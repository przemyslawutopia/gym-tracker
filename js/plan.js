const VARIANTS = {
  bench_press: [
    { id: 'cambered', name: 'Cambered bar flat bench' },
    { id: 'classic',  name: 'Classic flat bench' },
  ],
  lat_pulldown: [
    { id: 'wide',   name: 'Lat pulldown (shoulder-width)' },
    { id: 'vgrip',  name: 'V-grip lat pulldown' },
    { id: 'pullup', name: 'Pull-ups' },
  ],
  overhead_press: [
    { id: 'smith',    name: 'Smith machine seated' },
    { id: 'dumbbell', name: 'Dumbbells seated' },
    { id: 'barbell',  name: 'Barbell standing' },
  ],
  barbell_row: [
    { id: 'cable_vgrip', name: 'Cable row V-grip (narrow)' },
    { id: 'cable_wide',  name: 'Cable row (shoulder-width)' },
    { id: 'single_arm',  name: 'Single-arm dumbbell row' },
  ],
  lateral_raise: [
    { id: 'dumbbells', name: 'Dumbbells' },
    { id: 'cables',    name: 'Cables (single arm)' },
  ],
  triceps_overhead: [
    { id: 'cable_single', name: 'Overhead cable (single arm)' },
    { id: 'ezbar',        name: 'Overhead EZ-bar' },
  ],
  leg_extension: [
    { id: 'bilateral', name: 'Leg extension (bilateral)' },
    { id: 'single',    name: 'Leg extension (single leg)' },
  ],
  leg_curl: [
    { id: 'bilateral', name: 'Leg curl (bilateral)' },
    { id: 'single',    name: 'Leg curl (single leg)' },
  ],
};

const PLAN = {
  A: {
    label: 'Day A',
    exercises: [
      { id: 'bench_press',    name: 'Bench Press',    sets: 4, superset: null,    variantKey: 'bench_press',    defaultVariant: 'cambered'    },
      { id: 'lat_pulldown',   name: 'Lat Pulldown',   sets: 3, superset: null,    variantKey: 'lat_pulldown',   defaultVariant: 'wide'        },
      { id: 'overhead_press', name: 'Overhead Press', sets: 3, superset: null,    variantKey: 'overhead_press', defaultVariant: 'smith'       },
      { id: 'barbell_row',    name: 'Barbell Row',    sets: 3, superset: null,    variantKey: 'barbell_row',    defaultVariant: 'cable_vgrip' },
      { id: 'lateral_raise_a',name: 'Lateral Raise',  sets: 4, superset: 'ss_a1', variantKey: 'lateral_raise',  defaultVariant: 'dumbbells'   },
      { id: 'rear_delt',      name: 'Rear Delt Fly',  sets: 4, superset: 'ss_a1', variantKey: null,             defaultVariant: null          },
    ]
  },
  B: {
    label: 'Day B',
    exercises: [
      { id: 'squat',            name: 'Squat',                       sets: 4, superset: null, variantKey: null,               defaultVariant: null           },
      { id: 'rdl',              name: 'RDL',                         sets: 3, superset: null, variantKey: null,               defaultVariant: null           },
      { id: 'triceps_pushdown', name: 'Triceps Overhead Extension',  sets: 3, superset: null, variantKey: 'triceps_overhead', defaultVariant: 'cable_single' },
      { id: 'preacher_curl',    name: 'Preacher Curl (single arm)',  sets: 3, superset: null, variantKey: null,               defaultVariant: null           },
      { id: 'calf_raises',      name: 'Calf Raises',                 sets: 3, superset: null, variantKey: null,               defaultVariant: null           },
      { id: 'allahy',           name: 'Allahy',                      sets: 3, superset: null, variantKey: null,               defaultVariant: null           },
    ]
  },
  C: {
    label: 'Day C',
    exercises: [
      { id: 'bench_press',    name: 'Bench Press',    sets: 4, superset: null, variantKey: 'bench_press',    defaultVariant: 'cambered' },
      { id: 'lat_pulldown',   name: 'Lat Pulldown',   sets: 3, superset: null, variantKey: 'lat_pulldown',   defaultVariant: 'wide'     },
      { id: 'overhead_press', name: 'Overhead Press', sets: 3, superset: null, variantKey: 'overhead_press', defaultVariant: 'smith'    },
      { id: 'lateral_raise_c',name: 'Lateral Raise',  sets: 4, superset: null, variantKey: 'lateral_raise',  defaultVariant: 'cables'   },
      { id: 'lower_abs_c',    name: 'Lower Abs',      sets: 2, superset: null, variantKey: null,             defaultVariant: null       },
      { id: 'shrugs',         name: 'Shrugs',         sets: 3, superset: null, variantKey: null,             defaultVariant: null       },
    ]
  },
  D: {
    label: 'Day D',
    exercises: [
      { id: 'chest_fly',      name: 'Chest Fly',      sets: 3, superset: null,    variantKey: null,            defaultVariant: null        },
      { id: 'leg_extension',  name: 'Leg Extension',  sets: 3, superset: null,    variantKey: 'leg_extension', defaultVariant: 'bilateral' },
      { id: 'leg_curl',       name: 'Leg Curl',       sets: 3, superset: null,    variantKey: 'leg_curl',      defaultVariant: 'bilateral' },
      { id: 'barbell_row',    name: 'Barbell Row',    sets: 3, superset: null,    variantKey: 'barbell_row',   defaultVariant: 'cable_wide'},
      { id: 'triceps_ss',     name: 'Triceps',        sets: 3, superset: 'ss_d1', variantKey: null,            defaultVariant: null        },
      { id: 'biceps_ss',      name: 'Biceps',         sets: 3, superset: 'ss_d1', variantKey: null,            defaultVariant: null        },
      { id: 'lower_abs_d',    name: 'Lower Abs',      sets: 2, superset: null,    variantKey: null,            defaultVariant: null        },
      { id: 'lateral_raise_d',name: 'Lateral Raise',  sets: 4, superset: null,    variantKey: 'lateral_raise', defaultVariant: 'dumbbells' },
    ]
  }
};
