#pragma once
#include <array>
#include <cstdint>
#include <deque>
#include <map>
#include <string>
#include <vector>

namespace abbey {
constexpr int width = 40, height = 32, plane = width * height, node_count = plane * 3;
constexpr int ticks_per_day = 9000; // 100 ms per tick: twelve daylight minutes, three night minutes.
constexpr int units_per_tile = 1000;
enum class Activity : int { Work, Travel, Prayer, Eat, Sleep, Blocked };
enum class Duty : int { Garden, Kitchen, Masonry, Stores, Letters, Market };
struct Office {
    const char *name;
    int start;
    int duration;
    const char *explanation;
};
const std::array<Office, 8> &offices();
const char *activity_name(Activity a);
const char *duty_name(Duty d);
struct Person {
    std::uint32_t id{};
    std::string name;
    bool monk{};
    int age{}, trait{}, skill{}, hunger{}, fatigue{};
    Duty duty{};
    Activity activity{Activity::Work}, intention{Activity::Work};
    int node{}, next_node{-1}, progress{}, destination{}, work_progress{};
    std::int64_t meals{}, work_units{}, services{};
};
struct Event {
    std::int64_t tick;
    std::string message;
};
struct Statistics {
    std::int64_t grain{}, meals{}, stone{}, timber{}, coin{}, meals_cooked{}, meals_eaten{},
        grain_harvested{};
    int bay_work{};
};
class Simulation {
  public:
    explicit Simulation(std::uint32_t population = 96, std::uint32_t seed = 1135);
    void step(int ticks = 1);
    bool assign(std::uint32_t id, Duty duty);
    bool commission_bay();
    bool set_closed(int node, bool closed);
    bool save(const std::string &path, std::string &error) const;
    bool load(const std::string &path, std::string &error);
    std::string serialize() const;
    bool deserialize(const std::string &text, std::string &error);
    std::uint64_t digest() const;
    int current_office() const;
    int next_office() const;
    int ticks_to_next_office() const;
    const std::vector<Person> &people() const {
        return people_;
    }
    const Person *person(std::uint32_t id) const;
    const Statistics &stats() const {
        return stats_;
    }
    const std::deque<Event> &events() const {
        return events_;
    }
    std::int64_t tick() const {
        return tick_;
    }
    bool bay_commissioned() const {
        return commissioned_;
    }
    std::string reason(const Person &p) const;
    std::array<float, 3> position(const Person &p) const;
    bool walkable(int node) const;
    bool adjacent(int a, int b) const;
    const std::vector<int> &route_field(int destination);
    static int node(int x, int y, int floor = 0) {
        return (floor + 1) * plane + y * width + x;
    }

  private:
    std::vector<Person> people_;
    std::array<bool, node_count> terrain_{};
    std::array<bool, node_count> closed_{};
    std::map<int, std::vector<int>> routes_;
    std::deque<Event> events_;
    Statistics stats_{};
    std::int64_t tick_{6000};
    std::uint32_t rng_{};
    bool commissioned_{};
    void make_world();
    void choose_task(Person &p);
    void update_person(Person &p);
    std::vector<int> neighbors(int n) const;
    int work_destination(const Person &p) const;
    int home_destination(const Person &p) const;
    void log(std::string message);
};
} // namespace abbey
