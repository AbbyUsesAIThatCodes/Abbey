#include "abbey/simulation.hpp"
#include <godot_cpp/classes/ref_counted.hpp>
#include <godot_cpp/core/class_db.hpp>
#include <godot_cpp/godot.hpp>
#include <godot_cpp/variant/array.hpp>
#include <godot_cpp/variant/dictionary.hpp>
#include <godot_cpp/variant/packed_float32_array.hpp>
#include <memory>

using namespace godot;
class AbbeySimulation : public RefCounted {
    GDCLASS(AbbeySimulation, RefCounted)
    std::unique_ptr<abbey::Simulation> world_ = std::make_unique<abbey::Simulation>();

  protected:
    static void _bind_methods() {
        ClassDB::bind_method(D_METHOD("reset", "population", "seed"), &AbbeySimulation::reset);
        ClassDB::bind_method(D_METHOD("advance", "ticks"), &AbbeySimulation::advance);
        ClassDB::bind_method(D_METHOD("positions"), &AbbeySimulation::positions);
        ClassDB::bind_method(D_METHOD("summary"), &AbbeySimulation::summary);
        ClassDB::bind_method(D_METHOD("inspect_person", "id"), &AbbeySimulation::inspect_person);
        ClassDB::bind_method(D_METHOD("assign_duty", "id", "duty"), &AbbeySimulation::assign_duty);
        ClassDB::bind_method(D_METHOD("commission_bay"), &AbbeySimulation::commission_bay);
        ClassDB::bind_method(D_METHOD("save_game", "path"), &AbbeySimulation::save_game);
        ClassDB::bind_method(D_METHOD("load_game", "path"), &AbbeySimulation::load_game);
        ClassDB::bind_method(D_METHOD("digest"), &AbbeySimulation::digest);
    }

  public:
    bool reset(int population, int seed) {
        if (population < 8 || population > 10000)
            return false;
        world_ = std::make_unique<abbey::Simulation>(static_cast<std::uint32_t>(population),
                                                     static_cast<std::uint32_t>(seed));
        return true;
    }
    void advance(int ticks) {
        if (ticks >= 0 && ticks <= abbey::ticks_per_day * 4)
            world_->step(ticks);
    }
    PackedFloat32Array positions() const {
        const auto &people = world_->people();
        PackedFloat32Array packed;
        packed.resize(static_cast<int64_t>(people.size() * 6));
        float *out = packed.ptrw();
        for (const auto &p : people) {
            auto pos = world_->position(p);
            *out++ = static_cast<float>(p.id);
            *out++ = pos[0];
            *out++ = pos[1];
            *out++ = pos[2];
            *out++ = p.monk ? 1.f : 0.f;
            *out++ = static_cast<float>(p.activity);
        }
        return packed;
    }
    Dictionary summary() const {
        Dictionary d;
        const auto &s = world_->stats();
        int current = world_->current_office(), next = world_->next_office();
        d["tick"] = world_->tick();
        d["day"] = world_->tick() / abbey::ticks_per_day + 1;
        d["day_tick"] = world_->tick() % abbey::ticks_per_day;
        d["population"] = static_cast<int64_t>(world_->people().size());
        d["office"] =
            current < 0 ? "Work and community" : abbey::offices()[static_cast<std::size_t>(current)].name;
        d["next_office"] = abbey::offices()[static_cast<std::size_t>(next)].name;
        d["next_seconds"] = world_->ticks_to_next_office() / 10.0;
        d["grain"] = s.grain;
        d["meals"] = s.meals;
        d["timber"] = s.timber;
        d["stone"] = s.stone;
        d["coin"] = s.coin;
        d["bay_work"] = s.bay_work;
        d["commissioned"] = world_->bay_commissioned();
        Array history;
        for (const auto &e : world_->events())
            history.append(String(e.message.c_str()));
        d["chronicle"] = history;
        return d;
    }
    Dictionary inspect_person(int id) const {
        Dictionary d;
        if (id < 0)
            return d;
        auto *p = world_->person(static_cast<std::uint32_t>(id));
        if (!p)
            return d;
        d["id"] = id;
        d["name"] = p->name.c_str();
        d["monk"] = p->monk;
        d["age"] = p->age;
        d["duty"] = abbey::duty_name(p->duty);
        d["duty_id"] = static_cast<int>(p->duty);
        d["activity"] = abbey::activity_name(p->activity);
        d["reason"] = world_->reason(*p).c_str();
        d["skill"] = p->skill;
        d["hunger"] = p->hunger;
        d["fatigue"] = p->fatigue;
        const char *traits[] = {"Energetic", "Patient", "Generous", "Exacting"};
        d["trait"] = traits[p->trait];
        d["work_units"] = p->work_units;
        d["services"] = p->services;
        d["meals"] = p->meals;
        auto pos = world_->position(*p);
        d["x"] = pos[0];
        d["y"] = pos[1];
        d["floor"] = p->node / abbey::plane - 1;
        return d;
    }
    bool assign_duty(int id, int duty) {
        return id >= 0 && duty >= 0 && duty < 6 &&
               world_->assign(static_cast<std::uint32_t>(id), static_cast<abbey::Duty>(duty));
    }
    bool commission_bay() {
        return world_->commission_bay();
    }
    String save_game(const String &path) const {
        std::string error;
        world_->save(path.utf8().get_data(), error);
        return String(error.c_str());
    }
    String load_game(const String &path) {
        std::string error;
        world_->load(path.utf8().get_data(), error);
        return String(error.c_str());
    }
    String digest() const {
        return String(std::to_string(world_->digest()).c_str());
    }
};
void initialize_abbey(ModuleInitializationLevel level) {
    if (level == MODULE_INITIALIZATION_LEVEL_SCENE)
        ClassDB::register_class<AbbeySimulation>();
}
void uninitialize_abbey(ModuleInitializationLevel) {}
extern "C" {
GDExtensionBool GDE_EXPORT abbey_library_init(GDExtensionInterfaceGetProcAddress get_proc_address,
                                              GDExtensionClassLibraryPtr library,
                                              GDExtensionInitialization *initialization) {
    GDExtensionBinding::InitObject init(get_proc_address, library, initialization);
    init.register_initializer(initialize_abbey);
    init.register_terminator(uninitialize_abbey);
    init.set_minimum_library_initialization_level(MODULE_INITIALIZATION_LEVEL_SCENE);
    return init.init();
}
}
