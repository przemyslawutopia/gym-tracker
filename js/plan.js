const PLAN = {
  A: {
    label: 'Day A',
    exercises: [
      { id: 'bench_press',        name: 'Bench Press',              sets: 4, superset: null },
      { id: 'lat_pulldown',       name: 'Lat Pulldown',             sets: 3, superset: null },
      { id: 'overhead_press',     name: 'Overhead Press',           sets: 3, superset: null },
      { id: 'barbell_row',        name: 'Barbell Row',              sets: 3, superset: null },
      { id: 'lateral_raise_a',    name: 'Lateral Raise',            sets: 4, superset: 'ss_a1' },
      { id: 'rear_delt',          name: 'Rear Delt Fly',            sets: 4, superset: 'ss_a1' },
    ]
  },
  B: {
    label: 'Day B',
    exercises: [
      { id: 'squat',              name: 'Squat',                    sets: 4, superset: null },
      { id: 'rdl',                name: 'RDL',                      sets: 3, superset: null },
      { id: 'triceps_pushdown',   name: 'Triceps Pushdown (single arm)', sets: 3, superset: null },
      { id: 'preacher_curl',      name: 'Preacher Curl (single arm)',    sets: 3, superset: null },
      { id: 'calf_raises',        name: 'Calf Raises',              sets: 3, superset: null },
      { id: 'allahy',             name: 'Allahy',                   sets: 3, superset: null },
    ]
  },
  C: {
    label: 'Day C',
    exercises: [
      { id: 'bench_press',        name: 'Bench Press',              sets: 4, superset: null },
      { id: 'lat_pulldown',       name: 'Lat Pulldown',             sets: 3, superset: null },
      { id: 'overhead_press',     name: 'Overhead Press',           sets: 3, superset: null },
      { id: 'lateral_raise_c',    name: 'Lateral Raise',            sets: 4, superset: null },
      { id: 'lower_abs_c',        name: 'Lower Abs',                sets: 2, superset: null },
      { id: 'shrugs',             name: 'Shrugs',                   sets: 3, superset: null },
    ]
  },
  D: {
    label: 'Day D',
    exercises: [
      { id: 'chest_fly',          name: 'Chest Fly',                sets: 3, superset: null },
      { id: 'leg_extension',      name: 'Leg Extension',            sets: 3, superset: null },
      { id: 'leg_curl',           name: 'Leg Curl',                 sets: 3, superset: null },
      { id: 'barbell_row',        name: 'Barbell Row',              sets: 3, superset: null },
      { id: 'triceps_ss',         name: 'Triceps',                  sets: 3, superset: 'ss_d1' },
      { id: 'biceps_ss',          name: 'Biceps',                   sets: 3, superset: 'ss_d1' },
      { id: 'lower_abs_d',        name: 'Lower Abs',                sets: 2, superset: null },
      { id: 'lateral_raise_d',    name: 'Lateral Raise',            sets: 4, superset: null },
    ]
  }
};
