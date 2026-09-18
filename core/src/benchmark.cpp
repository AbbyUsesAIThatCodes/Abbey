#include "abbey/simulation.hpp"
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
using Clock = std::chrono::steady_clock;
int main(int argc, char **argv) {
    try {
        std::vector<int> populations{500, 2000, 5000};
        int ticks = 18000;
        for (int i = 1; i < argc; ++i) {
            std::string arg = argv[i];
            if (arg == "--population" && i + 1 < argc)
                populations = {std::stoi(argv[++i])};
            else if (arg == "--ticks" && i + 1 < argc)
                ticks = std::stoi(argv[++i]);
            else
                throw std::runtime_error("Usage: abbey_benchmark [--population N] [--ticks N]");
        }
        if (ticks < 100 || ticks > 900000)
            throw std::runtime_error("Ticks must be 100..900000");
        std::cout << "population,ticks,wall_seconds,mean_tick_ms,p95_tick_ms,max_tick_ms,position_batch_ms,"
                     "save_bytes,digest\n";
        for (int population : populations) {
            abbey::Simulation sim(static_cast<std::uint32_t>(population), 1135);
            sim.commission_bay();
            std::vector<double> times;
            times.reserve(static_cast<std::size_t>(ticks));
            auto start = Clock::now();
            for (int t = 0; t < ticks; ++t) {
                auto s = Clock::now();
                sim.step();
                times.push_back(std::chrono::duration<double, std::milli>(Clock::now() - s).count());
            }
            double wall = std::chrono::duration<double>(Clock::now() - start).count();
            // Equivalent core-side packed position payload; excludes Godot conversion and rendering.
            std::vector<float> positions;
            positions.reserve(static_cast<std::size_t>(population) * 6);
            auto packstart = Clock::now();
            for (auto &p : sim.people()) {
                auto xyz = sim.position(p);
                positions.insert(positions.end(), {static_cast<float>(p.id), xyz[0], xyz[1], xyz[2],
                                                   p.monk ? 1.f : 0.f, static_cast<float>(p.activity)});
            }
            auto packms = std::chrono::duration<double, std::milli>(Clock::now() - packstart).count();
            std::sort(times.begin(), times.end());
            std::cout << population << ',' << ticks << ',' << std::fixed << std::setprecision(6) << wall
                      << ',' << wall * 1000 / ticks << ','
                      << times[static_cast<std::size_t>(ticks) * 95 / 100] << ',' << times.back() << ','
                      << packms << ',' << sim.serialize().size() << ',' << sim.digest() << '\n';
        }
    } catch (const std::exception &e) {
        std::cerr << e.what() << '\n';
        return 1;
    }
}
