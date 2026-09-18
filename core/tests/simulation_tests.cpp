#include "abbey/simulation.hpp"
#include <filesystem>
#include <iostream>
#include <stdexcept>
#include <string>
using namespace abbey;
void check(bool ok, const char *message) {
    if (!ok)
        throw std::runtime_error(message);
}
int main() {
    try {
        Simulation a(96, 1135), b(96, 1135);
        a.step(327);
        b.step(327);
        check(a.digest() == b.digest(), "Identical commands must reproduce state");
        std::string error;
        Simulation restored(8);
        check(restored.deserialize(a.serialize(), error), error.c_str());
        check(a.digest() == restored.digest(), "Save must preserve the complete state, including movement");
        a.step(9000);
        restored.step(9000);
        check(a.digest() == restored.digest(), "Reloaded simulation must continue identically");
        auto before = restored.digest();
        check(!restored.deserialize("ABBEY 99", error), "Unknown save versions must fail");
        check(before == restored.digest(), "Failed load must preserve running world");
        check(!restored.deserialize(a.serialize().substr(0, 120), error), "Truncated saves must fail");
        check(before == restored.digest(), "Truncated load changed state");
        check(!restored.deserialize(a.serialize() + "junk", error), "Trailing corruption must fail");
        Simulation nav(8);
        int upstairs = Simulation::node(9, 19, 1), cellar = Simulation::node(9, 19, -1);
        check(nav.route_field(upstairs)[static_cast<std::size_t>(cellar)] > 0,
              "Cellar must connect to upper floor through stairs");
        check(!nav.walkable(Simulation::node(28, 7)), "Pond must be impassable");
        check(!nav.adjacent(Simulation::node(9, 19), upstairs), "Floors must connect only at stairs");
        const int door = Simulation::node(16, 14);
        check(nav.set_closed(door, true), "Church door should close when unoccupied");
        check(nav.route_field(Simulation::node(15, 9))[static_cast<std::size_t>(Simulation::node(20, 16))] ==
                  -1,
              "Closed door must disconnect church");
        nav.step(450);
        bool blocked = false;
        for (auto &p : nav.people())
            blocked |= p.monk && p.activity == Activity::Blocked;
        check(blocked, "Unreachable worship must be inspectable");
        check(nav.set_closed(door, false), "Door should reopen");
        nav.step(240);
        bool prayer = false;
        for (auto &p : nav.people())
            prayer |= p.monk && p.activity == Activity::Prayer;
        check(prayer, "Monks should recover after route reopens");
        Simulation day(8);
        day.step(9000);
        int bells = 0;
        for (auto &e : day.events())
            if (e.message.find("bell calls") != std::string::npos)
                ++bells;
        check(bells == 8, "Every day must emit all eight offices exactly once");
        check(day.stats().meals_eaten > 0, "Common meal must consume food");
        check(day.stats().meals == 24 + day.stats().meals_cooked - day.stats().meals_eaten,
              "Prepared food must balance");
        check(day.stats().grain >= 0, "Grain must never go negative");
        Simulation build(8);
        auto stocks = build.stats();
        check(build.commission_bay(), "Bay must be commissionable");
        check(!build.commission_bay(), "Bay must never be charged twice");
        check(build.stats().stone == stocks.stone - 40 && build.stats().timber == stocks.timber - 20 &&
                  build.stats().coin == stocks.coin - 30,
              "Construction cost must be exact");
        check(build.assign(3, Duty::Masonry), "Duty command should succeed");
        build.step(18000);
        check(build.stats().bay_work > 0, "Assigned mason must build when on site");
        check(!build.assign(9999, Duty::Garden), "Invalid person command must fail");
        check(!build.assign(0, static_cast<Duty>(99)), "Invalid duty must fail");
        for (const auto &p : build.people()) {
            check(build.walkable(p.node), "Person left navigable world");
            if (p.next_node >= 0)
                check(build.adjacent(p.node, p.next_node), "Person crossed a nonadjacent edge");
        }
        const auto temp = std::filesystem::temp_directory_path() / "abbey-core-test.save";
        check(build.save(temp.string(), error), error.c_str());
        build.step(7);
        check(build.save(temp.string(), error), error.c_str());
        Simulation disk(8);
        check(disk.load(temp.string(), error), error.c_str());
        check(disk.digest() == build.digest(), "Disk save mismatch");
        check(std::filesystem::exists(temp.string() + ".bak"), "Backup must be retained");
        std::filesystem::remove(temp);
        std::filesystem::remove(temp.string() + ".bak");
        std::cout << "PASS: deterministic continuation, save validation, floor routing, blocked-route "
                     "recovery, eight offices, food accounting, construction, commands, disk backups\n";
    } catch (const std::exception &e) {
        std::cerr << "FAIL: " << e.what() << '\n';
        return 1;
    }
}
