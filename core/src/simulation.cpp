#include "abbey/simulation.hpp"
#include <algorithm>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <limits>
#include <queue>
#include <sstream>
#include <stdexcept>
#ifdef _WIN32
#ifndef NOMINMAX
#define NOMINMAX
#endif
#include <windows.h>
#endif

namespace abbey {
namespace {
std::filesystem::path utf8_path(const std::string &value) {
    return std::filesystem::path(std::u8string(value.begin(), value.end()));
}
} // namespace
const std::array<Office, 8> &offices() {
    static const std::array<Office, 8> o{{{"Lauds", 0, 220, "Prayer at dawn"},
                                          {"Prime", 450, 180, "Early morning prayer"},
                                          {"Terce", 1700, 140, "Midmorning prayer"},
                                          {"Sext", 3400, 160, "Midday prayer"},
                                          {"None", 4800, 140, "Afternoon prayer"},
                                          {"Vespers", 6400, 320, "Evening prayer"},
                                          {"Compline", 7200, 200, "Prayer before rest"},
                                          {"Matins", 8550, 280, "The night office"}}};
    return o;
}
const char *activity_name(Activity a) {
    switch (a) {
    case Activity::Work:
        return "Working";
    case Activity::Travel:
        return "Walking";
    case Activity::Prayer:
        return "At prayer";
    case Activity::Eat:
        return "At table";
    case Activity::Sleep:
        return "Resting";
    case Activity::Blocked:
        return "Route blocked";
    }
    return "Unknown";
}
const char *duty_name(Duty d) {
    switch (d) {
    case Duty::Garden:
        return "Gardening";
    case Duty::Kitchen:
        return "Provisioning";
    case Duty::Masonry:
        return "Masonry";
    case Duty::Stores:
        return "Stewardship";
    case Duty::Letters:
        return "Letters";
    case Duty::Market:
        return "Trading";
    }
    return "Unknown";
}
void Simulation::make_world() {
    terrain_.fill(false);
    for (int y = 1; y < height - 1; ++y)
        for (int x = 1; x < width - 1; ++x)
            terrain_[node(x, y)] = true;
    // Church walls with a south doorway; seats and floors are physical destinations.
    for (int y = 5; y <= 14; ++y)
        for (int x = 12; x <= 19; ++x)
            if (x == 12 || x == 19 || y == 5 || y == 14)
                terrain_[node(x, y)] = false;
    terrain_[node(16, 14)] = true;
    // Refectory below the dormitory; cellar below both. One vertical stair joins all floors.
    for (int z = -1; z <= 1; ++z)
        for (int y = 17; y <= 21; ++y)
            for (int x = 7; x <= 14; ++x)
                terrain_[node(x, y, z)] = (x > 7 && x < 14 && y > 17 && y < 21);
    for (int z = -1; z <= 1; ++z)
        terrain_[node(13, 20, z)] = true;
    terrain_[node(14, 20)] = true;
    // A pond is genuinely impassable, so routing has to go around it.
    for (int y = 5; y <= 9; ++y)
        for (int x = 27; x <= 32; ++x)
            terrain_[node(x, y)] = false;
}
Simulation::Simulation(std::uint32_t population, std::uint32_t seed) : rng_(seed ? seed : 1) {
    if (population < 8 || population > 10000)
        throw std::invalid_argument("Population must be between 8 and 10000");
    make_world();
    static const char *monks[] = {"Anselm", "Oswin", "Martin", "Thomas", "Hugh", "Peter"};
    static const char *lay[] = {"Agnes", "Walter", "Alice", "Edith", "Robert",  "Matilda",
                                "Henry", "Joan",   "Simon", "Emma",  "Gilbert", "Beatrice"};
    const std::uint32_t monk_count =
        population == 8 ? 6 : std::min<std::uint32_t>(32, std::max<std::uint32_t>(6, population / 16));
    for (std::uint32_t i = 0; i < population; ++i) {
        rng_ ^= rng_ << 13;
        rng_ ^= rng_ >> 17;
        rng_ ^= rng_ << 5;
        Person p;
        p.id = i;
        p.monk = i < monk_count;
        p.name = p.monk ? std::string(i == 5 ? "Novice " : "Brother ") + monks[i % 6]
                        : std::string(lay[(i - monk_count) % 12]);
        if ((p.monk && i >= 6) || (!p.monk && i >= monk_count + 12))
            p.name += " " + std::to_string(i + 1);
        p.age = 18 + static_cast<int>(rng_ % 48);
        p.trait = static_cast<int>(rng_ % 4);
        p.skill = 2 + static_cast<int>((rng_ >> 4) % 7);
        p.duty = static_cast<Duty>(i % 6);
        static const Duty founding[] = {Duty::Letters, Duty::Stores,  Duty::Kitchen, Duty::Masonry,
                                        Duty::Garden,  Duty::Letters, Duty::Market,  Duty::Masonry};
        if (i < 8)
            p.duty = founding[i];
        p.node = node(20 + static_cast<int>(i % 6), 16 + static_cast<int>((i / 6) % 9));
        p.destination = p.node;
        people_.push_back(p);
    }
    stats_.grain = static_cast<std::int64_t>(population) * 5;
    stats_.meals = static_cast<std::int64_t>(population) * 3;
    stats_.stone = 80;
    stats_.timber = 60;
    stats_.coin = 120;
    for (auto &p : people_)
        choose_task(p);
    log("The founding community begins its afternoon duties.");
}
bool Simulation::walkable(int n) const {
    return n >= 0 && n < node_count && terrain_[static_cast<std::size_t>(n)] &&
           !closed_[static_cast<std::size_t>(n)];
}
std::vector<int> Simulation::neighbors(int n) const {
    std::vector<int> out;
    out.reserve(6);
    const int x = n % width, y = (n % plane) / width, z = n / plane - 1;
    for (auto [dx, dy] : {std::pair{1, 0}, {-1, 0}, {0, 1}, {0, -1}}) {
        if (x + dx >= 0 && x + dx < width && y + dy >= 0 && y + dy < height) {
            int v = node(x + dx, y + dy, z);
            if (walkable(v))
                out.push_back(v);
        }
    }
    if (x == 13 && y == 20)
        for (int dz : {-1, 1})
            if (z + dz >= -1 && z + dz <= 1 && walkable(node(x, y, z + dz)))
                out.push_back(node(x, y, z + dz));
    return out;
}
bool Simulation::adjacent(int a, int b) const {
    auto ns = neighbors(a);
    return std::find(ns.begin(), ns.end(), b) != ns.end();
}
const std::vector<int> &Simulation::route_field(int destination) {
    auto found = routes_.find(destination);
    if (found != routes_.end())
        return found->second;
    std::vector<int> d(node_count, -1);
    std::queue<int> q;
    if (walkable(destination)) {
        d[static_cast<std::size_t>(destination)] = 0;
        q.push(destination);
    }
    while (!q.empty()) {
        int n = q.front();
        q.pop();
        for (int v : neighbors(n))
            if (d[static_cast<std::size_t>(v)] < 0) {
                d[static_cast<std::size_t>(v)] = d[static_cast<std::size_t>(n)] + 1;
                q.push(v);
            }
    }
    return routes_.emplace(destination, std::move(d)).first->second;
}
int Simulation::current_office() const {
    int t = static_cast<int>(tick_ % ticks_per_day);
    for (int i = 0; i < 8; ++i) {
        const auto &o = offices()[static_cast<std::size_t>(i)];
        if (t >= o.start && t < o.start + o.duration)
            return i;
    }
    return -1;
}
int Simulation::next_office() const {
    int t = static_cast<int>(tick_ % ticks_per_day);
    for (int i = 0; i < 8; ++i)
        if (offices()[static_cast<std::size_t>(i)].start > t)
            return i;
    return 0;
}
int Simulation::ticks_to_next_office() const {
    int n =
        offices()[static_cast<std::size_t>(next_office())].start - static_cast<int>(tick_ % ticks_per_day);
    return n > 0 ? n : n + ticks_per_day;
}
int Simulation::work_destination(const Person &p) const {
    switch (p.duty) {
    case Duty::Garden:
        return node(7 + static_cast<int>(p.id % 4), 8 + static_cast<int>(p.id % 3));
    case Duty::Kitchen:
        return node(9, 19);
    case Duty::Masonry:
        return node(22 + static_cast<int>(p.id % 3), 9);
    case Duty::Stores:
        return node(9 + static_cast<int>(p.id % 3), 19, -1);
    case Duty::Letters:
        return node(10 + static_cast<int>(p.id % 3), 18, 1);
    case Duty::Market:
        return node(24 + static_cast<int>(p.id % 5), 19 + static_cast<int>((p.id / 5) % 3));
    }
    return p.node;
}
int Simulation::home_destination(const Person &p) const {
    return p.monk ? node(8 + static_cast<int>(p.id % 5), 18 + static_cast<int>((p.id / 5) % 3), 1)
                  : node(22 + static_cast<int>(p.id % 12), 25 + static_cast<int>((p.id / 12) % 4));
}
void Simulation::choose_task(Person &p) {
    const int t = static_cast<int>(tick_ % ticks_per_day);
    p.intention = Activity::Work;
    p.destination = work_destination(p);
    if (p.monk && current_office() >= 0) {
        p.intention = Activity::Prayer;
        p.destination = node(14 + static_cast<int>(p.id % 4), 7 + static_cast<int>((p.id / 4) % 6));
    } else if (t >= 7450 || t < 220) {
        p.intention = Activity::Sleep;
        p.destination = home_destination(p);
    } else if (t >= 3600 && t < 4150) {
        p.intention = Activity::Eat;
        p.destination =
            p.monk ? node(8 + static_cast<int>(p.id % 5), 19) : node(25 + static_cast<int>(p.id % 4), 20);
    }
    p.activity = p.node == p.destination && p.next_node < 0 ? p.intention : Activity::Travel;
}
void Simulation::update_person(Person &p) {
    if (p.next_node >= 0) {
        p.progress += 200 + (p.trait == 0 ? 50 : 0);
        if (p.progress >= units_per_tile) {
            p.node = p.next_node;
            p.next_node = -1;
            p.progress = 0;
        }
    }
    if (p.next_node < 0 && p.node != p.destination) {
        const auto &d = route_field(p.destination);
        int best = -1, dist = d[static_cast<std::size_t>(p.node)];
        if (dist > 0)
            for (int v : neighbors(p.node))
                if (d[static_cast<std::size_t>(v)] == dist - 1) {
                    best = v;
                    break;
                }
        if (best < 0) {
            p.activity = Activity::Blocked;
            return;
        }
        p.next_node = best;
        p.activity = Activity::Travel;
        return;
    }
    if (p.node != p.destination || p.next_node >= 0) {
        p.activity = Activity::Travel;
        return;
    }
    p.activity = p.intention;
    if (p.activity == Activity::Sleep) {
        if (tick_ % 10 == 0)
            p.fatigue = std::max(0, p.fatigue - 1);
        return;
    }
    if (p.activity == Activity::Eat) {
        if (p.hunger > 0 && tick_ % 20 == p.id % 20 && stats_.meals > 0) {
            --stats_.meals;
            ++stats_.meals_eaten;
            ++p.meals;
            p.hunger = 0;
        }
        return;
    }
    if (p.activity == Activity::Prayer) {
        if (tick_ % 40 == p.id % 40)
            p.fatigue = std::max(0, p.fatigue - 1);
        return;
    }
    if (p.activity != Activity::Work)
        return;
    // Progress survives scheduled interruptions. Each completed recipe accounts for its inputs.
    if (++p.work_progress < 100 - p.skill * 4)
        return;
    p.work_progress = 0;
    ++p.work_units;
    switch (p.duty) {
    case Duty::Garden:
        ++stats_.grain;
        ++stats_.grain_harvested;
        break;
    case Duty::Kitchen:
        if (stats_.grain > 0) {
            --stats_.grain;
            stats_.meals += 2;
            stats_.meals_cooked += 2;
        }
        break;
    case Duty::Masonry:
        if (commissioned_ && stats_.bay_work < 600) {
            ++stats_.bay_work;
            if (stats_.bay_work == 600)
                log("The first chapel bay is complete. Its builders have left their mark.");
        }
        break;
    case Duty::Stores:
        if (p.work_units % 4 == 0)
            ++stats_.timber;
        break;
    case Duty::Letters:
        if (p.work_units % 12 == 0)
            p.skill = std::min(10, p.skill + 1);
        break;
    case Duty::Market:
        if (stats_.grain > static_cast<std::int64_t>(people_.size()) * 2) {
            --stats_.grain;
            ++stats_.coin;
        }
        break;
    }
}
void Simulation::step(int ticks) {
    if (ticks < 0 || ticks > ticks_per_day * 4)
        throw std::invalid_argument("Invalid step count");
    for (int s = 0; s < ticks; ++s) {
        ++tick_;
        int t = static_cast<int>(tick_ % ticks_per_day);
        bool transition = t == 7450 || t == 3600 || t == 4150 || t == 220;
        for (const auto &o : offices()) {
            if (t == o.start) {
                transition = true;
                log(std::string("The bell calls the brothers to ") + o.name + ".");
            }
            if (t == o.start + o.duration) {
                transition = true;
                for (auto &p : people_)
                    if (p.monk && p.activity == Activity::Prayer)
                        ++p.services;
            }
        }
        for (auto &p : people_) {
            if (transition)
                choose_task(p);
            if (tick_ % 100 == p.id % 100) {
                p.hunger = std::min(100, p.hunger + 1);
                if (p.activity != Activity::Sleep)
                    p.fatigue = std::min(100, p.fatigue + 1);
            }
            update_person(p);
        }
    }
}
const Person *Simulation::person(std::uint32_t id) const {
    return id < people_.size() ? &people_[id] : nullptr;
}
bool Simulation::assign(std::uint32_t id, Duty duty) {
    if (id >= people_.size() || static_cast<int>(duty) < 0 || static_cast<int>(duty) > 5)
        return false;
    auto &p = people_[id];
    p.duty = duty;
    p.work_progress = 0;
    choose_task(p);
    log(p.name + " is assigned to " + duty_name(duty) + ".");
    return true;
}
bool Simulation::commission_bay() {
    if (commissioned_ || stats_.stone < 40 || stats_.timber < 20 || stats_.coin < 30)
        return false;
    stats_.stone -= 40;
    stats_.timber -= 20;
    stats_.coin -= 30;
    commissioned_ = true;
    log("A stone chapel bay is commissioned: 40 stone, 20 timber and 30 coin committed.");
    return true;
}
bool Simulation::set_closed(int n, bool closed) {
    if (n < 0 || n >= node_count || !terrain_[static_cast<std::size_t>(n)])
        return false;
    if (closed)
        for (const auto &p : people_)
            if (p.node == n || p.next_node == n)
                return false;
    closed_[static_cast<std::size_t>(n)] = closed;
    routes_.clear();
    return true;
}
void Simulation::log(std::string message) {
    events_.push_back({tick_, std::move(message)});
    while (events_.size() > 24)
        events_.pop_front();
}
std::string Simulation::reason(const Person &p) const {
    if (p.activity == Activity::Blocked)
        return "No open route reaches the destination. Reopen the church door or choose another duty.";
    if (p.intention == Activity::Prayer)
        return "The current office takes precedence over ordinary work. This brother is expected in the "
               "chapel.";
    if (p.intention == Activity::Sleep)
        return "The house is resting. Monks use the stair to the upper dormitory.";
    if (p.intention == Activity::Eat)
        return stats_.meals > 0 ? "The common meal is scheduled. Food is consumed from the shared stores."
                                : "The meal is scheduled, but the stores have no prepared food.";
    if (p.duty == Duty::Masonry && !commissioned_)
        return "Assigned to masonry; awaiting a commissioned chapel bay.";
    if (p.duty == Duty::Kitchen && stats_.grain == 0)
        return "Assigned to provisioning; grain is needed before another meal can be prepared.";
    return std::string("Assigned to ") + duty_name(p.duty) +
           ". Work pauses for this person's scheduled obligations.";
}
std::array<float, 3> Simulation::position(const Person &p) const {
    auto coords = [](int n) {
        return std::array<float, 3>{static_cast<float>(n % width), static_cast<float>((n % plane) / width),
                                    static_cast<float>(n / plane - 1)};
    };
    auto a = coords(p.node);
    if (p.next_node < 0)
        return a;
    auto b = coords(p.next_node);
    float f = static_cast<float>(p.progress) / units_per_tile;
    for (int i = 0; i < 3; ++i)
        a[static_cast<std::size_t>(i)] +=
            (b[static_cast<std::size_t>(i)] - a[static_cast<std::size_t>(i)]) * f;
    return a;
}
std::string Simulation::serialize() const {
    std::ostringstream o;
    o << "ABBEY 1\n" << tick_ << ' ' << rng_ << ' ' << commissioned_ << ' ' << people_.size() << '\n';
    const auto &s = stats_;
    o << s.grain << ' ' << s.meals << ' ' << s.stone << ' ' << s.timber << ' ' << s.coin << ' '
      << s.meals_cooked << ' ' << s.meals_eaten << ' ' << s.grain_harvested << ' ' << s.bay_work << '\n';
    int count = static_cast<int>(std::count(closed_.begin(), closed_.end(), true));
    o << count;
    for (int i = 0; i < node_count; ++i)
        if (closed_[static_cast<std::size_t>(i)])
            o << ' ' << i;
    o << '\n';
    for (const auto &p : people_)
        o << p.id << ' ' << std::quoted(p.name) << ' ' << p.monk << ' ' << p.age << ' ' << p.trait << ' '
          << p.skill << ' ' << p.hunger << ' ' << p.fatigue << ' ' << static_cast<int>(p.duty) << ' '
          << static_cast<int>(p.activity) << ' ' << static_cast<int>(p.intention) << ' ' << p.node << ' '
          << p.next_node << ' ' << p.progress << ' ' << p.destination << ' ' << p.work_progress << ' '
          << p.meals << ' ' << p.work_units << ' ' << p.services << '\n';
    o << events_.size() << '\n';
    for (const auto &e : events_)
        o << e.tick << ' ' << std::quoted(e.message) << '\n';
    return o.str();
}
bool Simulation::deserialize(const std::string &text, std::string &error) {
    error.clear();
    if (text.size() > 16 * 1024 * 1024) {
        error = "Save exceeds the prototype's size limit";
        return false;
    }
    std::istringstream in(text);
    std::string magic;
    int version = 0;
    in >> magic >> version;
    if (magic != "ABBEY" || version != 1) {
        error = "Unsupported Abbey save version";
        return false;
    }
    Simulation candidate(8);
    std::size_t count = 0;
    in >> candidate.tick_ >> candidate.rng_ >> candidate.commissioned_ >> count;
    if (!in || count < 8 || count > 10000 || candidate.tick_ < 0 || candidate.tick_ > 1000000000000LL) {
        error = "Invalid save header";
        return false;
    }
    auto &s = candidate.stats_;
    in >> s.grain >> s.meals >> s.stone >> s.timber >> s.coin >> s.meals_cooked >> s.meals_eaten >>
        s.grain_harvested >> s.bay_work;
    for (auto v :
         {s.grain, s.meals, s.stone, s.timber, s.coin, s.meals_cooked, s.meals_eaten, s.grain_harvested})
        if (v < 0 || v > 1000000000000LL) {
            error = "Invalid resource quantity";
            return false;
        }
    if (s.bay_work < 0 || s.bay_work > 600 || (!candidate.commissioned_ && s.bay_work != 0)) {
        error = "Invalid construction state";
        return false;
    }
    int closed_count = 0;
    in >> closed_count;
    if (closed_count < 0 || closed_count > node_count) {
        error = "Invalid blocked tiles";
        return false;
    }
    candidate.closed_.fill(false);
    for (int i = 0; i < closed_count; ++i) {
        int n = -1;
        in >> n;
        if (n < 0 || n >= node_count || !candidate.terrain_[static_cast<std::size_t>(n)]) {
            error = "Invalid blocked tile";
            return false;
        }
        candidate.closed_[static_cast<std::size_t>(n)] = true;
    }
    candidate.people_.clear();
    candidate.people_.reserve(count);
    for (std::size_t i = 0; i < count; ++i) {
        Person p;
        int duty = -1, activity = -1, intention = -1;
        in >> p.id >> std::quoted(p.name) >> p.monk >> p.age >> p.trait >> p.skill >> p.hunger >> p.fatigue >>
            duty >> activity >> intention >> p.node >> p.next_node >> p.progress >> p.destination >>
            p.work_progress >> p.meals >> p.work_units >> p.services;
        if (!in || p.id != i || p.name.empty() || p.name.size() > 128 || p.age < 0 || p.age > 120 ||
            p.trait < 0 || p.trait > 3 || p.skill < 0 || p.skill > 10 || p.hunger < 0 || p.hunger > 100 ||
            p.fatigue < 0 || p.fatigue > 100 || duty < 0 || duty > 5 || activity < 0 || activity > 5 ||
            intention < 0 || intention > 5 || !candidate.walkable(p.node) || p.destination < 0 ||
            p.destination >= node_count || !candidate.terrain_[static_cast<std::size_t>(p.destination)] ||
            p.next_node < -1 || p.next_node >= node_count || p.progress < 0 || p.progress >= units_per_tile ||
            p.work_progress < 0 || p.work_progress > 100 || p.meals < 0 || p.work_units < 0 ||
            p.services < 0 || p.meals > 1000000000000LL || p.work_units > 1000000000000LL ||
            p.services > 1000000000000LL) {
            error = "Invalid person record";
            return false;
        }
        if ((p.next_node >= 0 && !candidate.adjacent(p.node, p.next_node)) ||
            (p.next_node < 0 && p.progress != 0)) {
            error = "Invalid movement edge";
            return false;
        }
        p.duty = static_cast<Duty>(duty);
        p.activity = static_cast<Activity>(activity);
        p.intention = static_cast<Activity>(intention);
        candidate.people_.push_back(std::move(p));
    }
    std::size_t ec = 0;
    in >> ec;
    if (ec > 24) {
        error = "Invalid chronicle length";
        return false;
    }
    candidate.events_.clear();
    for (std::size_t i = 0; i < ec; ++i) {
        Event e{};
        in >> e.tick >> std::quoted(e.message);
        if (e.tick < 0 || e.tick > candidate.tick_ || e.message.size() > 1024) {
            error = "Invalid chronicle entry";
            return false;
        }
        candidate.events_.push_back(std::move(e));
    }
    if (!in) {
        error = "Truncated save";
        return false;
    }
    in >> std::ws;
    if (!in.eof()) {
        error = "Unexpected trailing save data";
        return false;
    }
    candidate.routes_.clear();
    *this = std::move(candidate);
    return true;
}
bool Simulation::save(const std::string &path, std::string &error) const {
    error.clear();
    try {
        const auto dest = utf8_path(path);
        const auto tmp = utf8_path(path + ".tmp");
        const auto backup = utf8_path(path + ".bak");
        {
            std::ofstream out(tmp, std::ios::binary | std::ios::trunc);
            out << serialize();
            out.flush();
            if (!out)
                throw std::runtime_error("Could not write temporary save");
        }
        if (std::filesystem::exists(dest)) {
            std::filesystem::copy_file(dest, backup, std::filesystem::copy_options::overwrite_existing);
        }
        // Replace without first deleting the destination; preserve one previous version.
#ifdef _WIN32
        if (!MoveFileExW(tmp.c_str(), dest.c_str(), MOVEFILE_REPLACE_EXISTING | MOVEFILE_WRITE_THROUGH))
            throw std::runtime_error("Could not replace save: Windows error " +
                                     std::to_string(GetLastError()));
#else
        std::filesystem::rename(tmp, dest);
#endif
        return true;
    } catch (const std::exception &e) {
        error = e.what();
        return false;
    }
}
bool Simulation::load(const std::string &path, std::string &error) {
    error.clear();
    try {
        std::ifstream in(utf8_path(path), std::ios::binary);
        if (!in) {
            error = "Could not open save";
            return false;
        }
        if (std::filesystem::file_size(utf8_path(path)) > 16 * 1024 * 1024) {
            error = "Save exceeds size limit";
            return false;
        }
        std::ostringstream out;
        out << in.rdbuf();
        return deserialize(out.str(), error);
    } catch (const std::exception &e) {
        error = e.what();
        return false;
    }
}
std::uint64_t Simulation::digest() const {
    std::uint64_t h = 14695981039346656037ULL;
    for (unsigned char c : serialize()) {
        h ^= c;
        h *= 1099511628211ULL;
    }
    return h;
}
} // namespace abbey
