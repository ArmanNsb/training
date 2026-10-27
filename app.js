/* =====================================================================
   CONFIG — public cloud settings live in cloud-config.js.
   The private owner sync code is entered in Settings and saved locally.
   ===================================================================== */
const CLOUD_CONFIG=window.TRAINING_CLOUD_CONFIG||{};
const CONFIG={
  server:{
    enabled:!!CLOUD_CONFIG.enabled,
    baseUrl:String(CLOUD_CONFIG.baseUrl||''),
    publicKey:String(CLOUD_CONFIG.publishableKey||''),
    token:''
  },
  met:{lifting:5.0,abs:3.8}, // MET values used for calorie estimates
  absMinutes:20,
  maxSessionMin:240,
  tombstoneDays:30,   // deleted workouts are purged locally after this many days
  overnightHours:6    // an unfinished workout keeps collecting sets past midnight for this long
};

/* ---------- Icons ---------- */
const sv=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC={
  back:sv('<path d="M15 6l-6 6l6 6"/>'),
  chev:sv('<path d="M9 6l6 6l-6 6"/>'),
  x:sv('<path d="M18 6L6 18M6 6l12 12"/>'),
  check:sv('<path d="M5 12l5 5L20 7"/>'),
  settings:sv('<circle cx="14" cy="6" r="2"/><path d="M4 6h8M16 6h4"/><circle cx="8" cy="12" r="2"/><path d="M4 12h2M10 12h10"/><circle cx="17" cy="18" r="2"/><path d="M4 18h11M19 18h1"/>'),
  yt:sv('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>'),
  ext:sv('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  plus:sv('<path d="M12 5v14M5 12h14"/>'),
  minus:sv('<path d="M5 12h14"/>'),
  pause:sv('<path d="M8 5v14M16 5v14"/>'),
  play:sv('<path d="M7 4v16l13-8z"/>'),
  refresh:sv('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'),
  info:sv('<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>'),
  clock:sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>'),
  flame:sv('<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7c1.5 1 2 2 2 3c0-3 1-4 1-6z"/>'),
  trend:sv('<path d="M3 17l6-6l4 4l8-8M14 7h7v7"/>'),
  up:sv('<path d="M12 19V5M6 11l6-6l6 6"/>'),
  down:sv('<path d="M12 5v14M6 13l6 6l6-6"/>'),
  link:sv('<path d="M9 15l6-6M11 6l.5-.5a4 4 0 0 1 5.66 5.66L16.5 12M13 18l-.5.5a4 4 0 0 1-5.66-5.66L7.5 12"/>'),
  trash:sv('<path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>'),
  download:sv('<path d="M12 4v11M7 10l5 5l5-5M5 20h14"/>'),
  upload:sv('<path d="M12 20V9M7 14l5-5l5 5M5 4h14"/>'),
  abs:sv('<rect x="6" y="3" width="12" height="18" rx="5"/><path d="M12 3v18M6 9h12M6 15h12"/>'),
  calendar:sv('<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 11h16"/>'),
  chart:sv('<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>'),
  trophy:sv('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M5 9a2 2 0 0 1 0-4h2M19 9a2 2 0 0 0 0-4h-2"/>'),
  alert:sv('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>'),
  cloud:sv('<path d="M7 18a4.6 4.4 0 0 1 0-9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7z"/>'),
  flag:sv('<path d="M5 21V4M5 4h11l-2 4l2 4H5"/>'),
  dumbbell:sv('<path d="M2 12h1M6 8H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1M9 12h6M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M22 12h-1"/>')
};

/* ---------- Exercise library ---------- */
const EX={
  inclineSmith:{name:'Incline Smith Press',type:'compound',group:'Chest',muscles:['Upper chest','Front delts','Triceps'],img:['Smith_Machine_Incline_Bench_Press','Barbell_Incline_Bench_Press_-_Medium_Grip'],yt:'incline smith machine press proper form',
    steps:['Set the bench to about 30° and position it so the bar lowers to your upper chest, just below the collarbones.','Grip slightly wider than shoulder width. Pull your shoulder blades back and down and plant your feet.','Unhook the bar and lower it under control (2–3 seconds) until it lightly touches your upper chest.','Press back up in a straight line, stopping just short of a hard lockout.'],
    tips:['Keep elbows roughly 45–60° from your torso, not flared straight out.','Keep your upper back pinned to the bench for the whole set.']},
  chestRow:{name:'Chest-Supported Row',type:'compound',group:'Back',muscles:['Mid back','Lats','Rear delts','Biceps'],img:['Lying_T-Bar_Row','Dumbbell_Incline_Row','Bent_Over_Two-Dumbbell_Row'],yt:'chest supported row proper form',
    steps:['Set the chest pad so you can reach the handles with arms fully extended and a stretch in your upper back.','Press your chest firmly into the pad and keep your neck neutral.','Pull the handles toward your lower ribs, driving your elbows back and squeezing your shoulder blades together.','Lower slowly to a full stretch, letting your shoulder blades spread apart.'],
    tips:['Keep your chest on the pad — no lifting off or swinging.','Think "elbows to back pockets," not "hands to chest."']},
  latPulldown:{name:'Neutral-Grip Lat Pulldown',type:'compound',group:'Back',muscles:['Lats','Upper back','Biceps'],img:['V-Bar_Pulldown','Close-Grip_Front_Lat_Pulldown','Wide-Grip_Lat_Pulldown'],yt:'neutral grip lat pulldown proper form',
    steps:['Attach a neutral-grip (V-bar or parallel) handle and lock your thighs under the pad.','Sit tall with a slight backward lean of about 10–15° and your chest up.','Pull the handle to your upper chest by driving your elbows down toward your hips.','Return slowly until your arms are straight and your lats are fully stretched.'],
    tips:['Don\'t yank with momentum or lean far back to finish reps.','Lead with your elbows — your hands are just hooks.']},
  machineChest:{name:'Machine Chest Press',type:'compound',group:'Chest',muscles:['Chest','Front delts','Triceps'],img:['Machine_Bench_Press','Leverage_Chest_Press'],yt:'machine chest press proper form',
    steps:['Adjust the seat so the handles line up with your mid chest.','Set your shoulder blades back against the pad and keep your feet flat.','Press the handles forward until your arms are nearly straight.','Return under control until you feel a deep stretch across your chest.'],
    tips:['Don\'t let your shoulders roll forward at the end of the press.','Control the stretch — no bouncing out of the bottom.']},
  cableLateral:{name:'Cable Lateral Raise',type:'isolation',group:'Shoulders',muscles:['Side delts'],img:['Cable_Seated_Lateral_Raise','One-Arm_Side_Laterals','Side_Lateral_Raise'],yt:'cable lateral raise proper form',
    steps:['Set the pulley at the lowest position, stand side-on to the machine and grab the handle with your far hand.','Lean slightly forward and keep a small, fixed bend in your elbow.','Raise your arm out to the side to about shoulder height, leading with the elbow.','Lower slowly, keeping tension on the cable at the bottom.'],
    tips:['No shrugging — keep your traps relaxed.','Light and strict beats heavy and swinging.']},
  reversePecDeck:{name:'Reverse Pec Deck',type:'isolation',group:'Shoulders',muscles:['Rear delts','Upper back'],img:['Reverse_Machine_Flyes','Reverse_Flyes'],yt:'reverse pec deck rear delt fly proper form',
    steps:['Set the handles to the rear position and adjust the seat so they\'re at shoulder height.','Face the pad with your chest against it and grab the handles.','Sweep your arms out and back in a wide arc with a slight bend in the elbows.','Return slowly until your hands are nearly together.'],
    tips:['Think "push your hands out wide," not "squeeze the shoulder blades."','Smooth, controlled reps — no jerking.']},
  ropePushdown:{name:'Rope Triceps Pushdown',type:'isolation',group:'Arms',muscles:['Triceps'],img:['Triceps_Pushdown_-_Rope_Attachment','Triceps_Pushdown'],yt:'rope triceps pushdown proper form',
    steps:['Attach a rope to a high pulley and stand close with a slight forward lean.','Pin your elbows to your sides.','Push down until your arms are fully straight, spreading the rope ends apart at the bottom.','Let your forearms come back up just past parallel while your elbows stay fixed.'],
    tips:['Only your forearms should move.','Get a full lockout on every rep.']},
  inclineCurl:{name:'Incline Dumbbell Curl',type:'isolation',group:'Arms',muscles:['Biceps (long head)'],img:['Incline_Dumbbell_Curl','Alternate_Incline_Dumbbell_Curl'],yt:'incline dumbbell curl proper form',
    steps:['Set a bench to 45–60° and sit back with your arms hanging straight down.','Turn your palms forward with elbows slightly behind your torso.','Curl the dumbbells up without letting your elbows drift forward.','Lower all the way down to a full stretch.'],
    tips:['Keep your shoulders back against the bench.','The deep stretch at the bottom is the point of this exercise.']},
  hackSquat:{name:'Hack Squat',type:'compound',group:'Quads',muscles:['Quads','Glutes'],img:['Hack_Squat','Barbell_Hack_Squat'],yt:'hack squat machine proper form',
    steps:['Set your back and shoulders flat against the pad with feet shoulder-width in the middle of the platform.','Release the safeties and brace your core.','Lower under control as deep as you can while keeping your back flat and heels down.','Drive through your whole foot to stand, without slamming into knee lockout.'],
    tips:['A lower foot placement shifts more work to the quads.','Don\'t let your lower back peel off the pad at the bottom.']},
  rdl:{name:'Romanian Deadlift',type:'compound',group:'Hamstrings',muscles:['Hamstrings','Glutes','Lower back'],img:['Romanian_Deadlift','Stiff-Legged_Barbell_Deadlift'],yt:'romanian deadlift proper form',
    steps:['Stand tall holding the bar at your hips, feet hip-width, knees softly bent.','Push your hips back and slide the bar down your thighs with a flat back.','Lower until you feel a strong hamstring stretch, usually around mid-shin.','Drive your hips forward to stand tall and squeeze your glutes.'],
    tips:['Keep the bar close to your legs the whole time.','It\'s a hip hinge — your knee angle barely changes.']},
  bulgarian:{name:'Bulgarian Split Squat',type:'compound',group:'Quads',side:true,muscles:['Quads','Glutes','Adductors'],img:['Split_Squat_with_Dumbbells','Dumbbell_Lunges'],yt:'bulgarian split squat proper form',
    steps:['Place your rear foot laces-down on a bench, front foot about a stride ahead.','Hold dumbbells at your sides with your torso tall or slightly forward.','Lower straight down until your back knee nearly touches the floor.','Push through your front foot to rise. Finish all reps, then switch legs.'],
    tips:['Slight forward lean = more glutes; upright torso = more quads.','Keep your front heel down throughout.']},
  seatedLegCurl:{name:'Seated Leg Curl',type:'isolation',group:'Hamstrings',muscles:['Hamstrings'],img:['Seated_Leg_Curl','Lying_Leg_Curls'],yt:'seated leg curl proper form',
    steps:['Align your knees with the machine\'s pivot point and lock the thigh pad down snugly.','Lean your torso slightly forward to increase the hamstring stretch.','Curl your heels under the seat as far as possible.','Return slowly until your legs are almost straight.'],
    tips:['Leaning forward makes this exercise more effective.','Keep your hips planted on the seat.']},
  standingCalf:{name:'Standing Calf Raise',type:'isolation',group:'Calves',muscles:['Calves (gastrocnemius)'],img:['Standing_Calf_Raises','Standing_Dumbbell_Calf_Raise'],yt:'standing calf raise proper form',
    steps:['Place the balls of your feet on the edge of the platform with knees straight but not locked.','Lower your heels into a deep stretch and pause for 1–2 seconds.','Rise as high as you can onto your toes.','Lower under control.'],
    tips:['The pause at the bottom removes the bounce.','Full range of motion beats heavy partial reps.']},
  pullUp:{name:'Pull-Up / Assisted Pull-Up',type:'compound',group:'Back',assist:true,muscles:['Lats','Upper back','Biceps'],img:['Pullups','Band_Assisted_Pull-Up','Chin-Up'],yt:'pull up proper form',
    steps:['Grip the bar slightly wider than shoulder width, palms facing away.','Start from a dead hang with your core braced and legs slightly in front.','Pull your elbows down toward your ribs until your chin clears the bar.','Lower all the way back to a full hang.'],
    tips:['Use the assisted machine or a band to stay in the 6–10 rep range.','Log the assistance weight. Leave it empty for bodyweight — less assistance counts as progress.','No kipping or swinging.']},
  dbBench:{name:'Flat Dumbbell Bench Press',type:'compound',group:'Chest',muscles:['Chest','Front delts','Triceps'],img:['Dumbbell_Bench_Press'],yt:'dumbbell bench press proper form',
    steps:['Sit with the dumbbells on your thighs and kick them up as you lie back.','Retract your shoulder blades and plant your feet.','Lower the dumbbells to chest level with elbows at about 45°.','Press up and slightly inward until your arms are nearly straight.'],
    tips:['Use the deeper stretch that dumbbells allow — under control.','Don\'t clang the dumbbells together at the top.']},
  seatedRow:{name:'Seated Cable Row',type:'compound',group:'Back',muscles:['Mid back','Lats','Rear delts'],img:['Seated_Cable_Rows'],yt:'seated cable row proper form',
    steps:['Sit with feet on the platform, knees slightly bent, and grab the handle.','Sit tall with your chest up.','Pull the handle to your lower stomach, keeping your elbows close.','Let your arms extend and your shoulder blades move forward for a full stretch.'],
    tips:['A little torso movement is fine; big rocking isn\'t.','Pause briefly at the squeeze.']},
  machineShoulder:{name:'Machine Shoulder Press',type:'compound',group:'Shoulders',muscles:['Front delts','Side delts','Triceps'],img:['Machine_Shoulder_Military_Press','Leverage_Shoulder_Press','Dumbbell_Shoulder_Press'],yt:'machine shoulder press proper form',
    steps:['Adjust the seat so the handles start around shoulder or chin level.','Keep your back flat against the pad.','Press overhead until your arms are nearly straight.','Lower under control to the starting position.'],
    tips:['Don\'t arch away from the back pad.','Keep your wrists stacked over your elbows.']},
  lowHighFly:{name:'Low-to-High Cable Fly',type:'isolation',group:'Chest',muscles:['Upper chest','Front delts'],img:['Low_Cable_Crossover','Cable_Crossover'],yt:'low to high cable fly proper form',
    steps:['Set both pulleys to the lowest position and step forward into a staggered stance.','Keep a slight, fixed bend in your elbows with palms facing forward.','Sweep your hands up and together in an arc to about upper-chest or chin height.','Return slowly until you feel a stretch across your chest.'],
    tips:['Keep the elbow angle fixed — it\'s a hug, not a press.','Squeeze your upper chest at the top.']},
  rearDeltFly:{name:'Rear-Delt Cable Fly / Reverse Pec Deck',type:'isolation',group:'Shoulders',muscles:['Rear delts','Upper back'],img:['Cable_Rear_Delt_Fly','Reverse_Machine_Flyes'],yt:'rear delt cable fly proper form',
    steps:['Set both pulleys at shoulder height. Cross the cables: left hand holds the right cable, right hand the left.','Step back with your arms extended in front at shoulder height.','Pull your hands out and back in a wide arc until they\'re in line with your body.','Return slowly. (Or use the reverse pec deck — same movement.)'],
    tips:['Think "push hands out wide" to keep it on the rear delts.','Use light weight and keep it smooth.']},
  overheadExt:{name:'Overhead Cable Triceps Extension',type:'isolation',group:'Arms',muscles:['Triceps (long head)'],img:['Cable_Rope_Overhead_Triceps_Extension'],yt:'overhead cable triceps extension proper form',
    steps:['Attach a rope at a low or mid pulley, face away and hold the rope behind your head.','Use a staggered stance and slight forward lean, elbows pointing forward near your head.','Extend your arms until they\'re straight.','Bend your elbows to a deep stretch behind your head.'],
    tips:['Keep your elbows from flaring wide.','The stretched position is what makes this exercise valuable.']},
  preacherCurl:{name:'Preacher Curl',type:'isolation',group:'Arms',muscles:['Biceps','Brachialis'],img:['Preacher_Curl','Machine_Preacher_Curls','One_Arm_Dumbbell_Preacher_Curl'],yt:'preacher curl proper form',
    steps:['Adjust the seat so your armpits sit snugly over the top of the pad.','Rest your arms flat on the pad with an underhand grip.','Curl up until just before your forearms are vertical.','Lower slowly until your arms are nearly straight.'],
    tips:['Don\'t drop into a hard lockout at the bottom.','Keep your upper arms glued to the pad.']},
  hipThrust:{name:'Hip Thrust',type:'compound',group:'Glutes',muscles:['Glutes','Hamstrings'],img:['Barbell_Hip_Thrust','Barbell_Glute_Bridge'],yt:'barbell hip thrust proper form',
    steps:['Rest your upper back (bottom of the shoulder blades) on a bench edge with a padded bar over your hips.','Plant your feet about shoulder-width so your shins are vertical at the top.','Drive through your heels to lift your hips until your torso is parallel to the floor.','Pause, squeeze your glutes, then lower under control.'],
    tips:['Chin tucked, ribs down — don\'t overarch your lower back.','Move from the hips, not the lower back.']},
  legPress:{name:'Leg Press',type:'compound',group:'Quads',muscles:['Quads','Glutes'],img:['Leg_Press'],yt:'leg press proper form',
    steps:['Sit with your back and hips flat against the seat, feet shoulder-width in the middle of the platform.','Release the safety handles.','Lower until your knees reach about 90° or deeper, as long as your hips don\'t curl up.','Press back up without locking your knees.'],
    tips:['Your lower back must stay on the pad.','Knees track in line with your toes.']},
  lyingLegCurl:{name:'Lying Leg Curl',type:'isolation',group:'Hamstrings',muscles:['Hamstrings'],img:['Lying_Leg_Curls'],yt:'lying leg curl proper form',
    steps:['Lie face down with your knees just off the pad edge and the roller just above your heels.','Grip the handles and press your hips into the pad.','Curl your heels toward your glutes.','Lower slowly until your legs are nearly straight.'],
    tips:['Keep your hips down throughout.','Control the lowering phase.']},
  backExt:{name:'45° Back Extension',type:'isolation',group:'Glutes',muscles:['Glutes','Hamstrings','Lower back'],img:['Hyperextensions_Back_Extensions','Hyperextensions_With_No_Hyperextension_Bench'],yt:'45 degree back extension glute focus proper form',
    steps:['Set the pad just below your hip crease with heels locked under the rollers.','Cross your arms on your chest, or hold a plate for extra load.','Hinge down at the hips to a strong hamstring stretch.','Rise until your body forms a straight line — don\'t overextend.'],
    tips:['Slightly rounding your upper back and squeezing your glutes shifts it toward the glutes.','Stop at a straight line, not past it.']},
  seatedCalf:{name:'Seated Calf Raise',type:'isolation',group:'Calves',muscles:['Calves (soleus)'],img:['Seated_Calf_Raise','Barbell_Seated_Calf_Raise'],yt:'seated calf raise proper form',
    steps:['Sit with the pad snug on your lower thighs and the balls of your feet on the platform.','Release the safety and lower your heels into a deep stretch. Pause.','Push up as high as you can.','Lower under control.'],
    tips:['Pause at the bottom of every rep.','Full range of motion beats heavy weight.']}
};

/* ---------- Equipment alternatives and machine guides ----------
   Each programmed movement keeps a primary option plus:
   1) a machine-based alternative that preserves the main movement pattern/target,
   2) a free-weight or bodyweight fallback for limited-equipment days.
   These are guidance only; the programmed sets/reps stay the same.
   ---------------------------------------------------------------- */
const MACHINE_GUIDES={
  smithIncline:{en:'Smith Machine',fa:'دستگاه اسمیت',about:'میله روی دو ریل ثابت بالا و پایین می‌رود و در چند ارتفاع قفل می‌شود. برای پرس بالا سینه، نیمکت را داخل دستگاه قرار می‌دهی.',setup:['زاویه نیمکت را حدود ۳۰ درجه بگذار و آن را طوری جابه‌جا کن که میله به قسمت بالای سینه برسد.','ارتفاع شروع میله را طوری تنظیم کن که با آرنج‌های کمی خمیده بتوانی آن را آزاد کنی.','گیره‌های ایمنی را کمی پایین‌تر از پایین‌ترین نقطه حرکت تنظیم کن.'],check:'قبل از اضافه کردن وزنه، یک ست خیلی سبک بزن و مطمئن شو میله به گردن یا صورت نزدیک نمی‌شود.'},
  chestRow:{en:'Chest-Supported Row Machine',fa:'دستگاه قایقی سینه‌تکیه‌دار',about:'یک پد جلوی سینه و دسته‌هایی در جلو دارد. تکیه‌گاه سینه اجازه نمی‌دهد با کمر تاب بدهی.',setup:['ارتفاع صندلی را طوری تنظیم کن که دسته‌ها تقریباً هم‌سطح پایین سینه یا دنده‌ها باشند.','سینه را کامل به پد بچسبان و در شروع دست‌ها را بدون بالا آمدن شانه‌ها دراز کن.','اگر دستگاه چند نوع دسته دارد، برای این برنامه دسته خنثی یا متوسط را انتخاب کن.'],check:'اگر برای رسیدن به دسته‌ها مجبور می‌شوی سینه را از پد جدا کنی، صندلی یا پد را دوباره تنظیم کن.'},
  latPulldown:{en:'Lat Pulldown Machine',fa:'دستگاه لت سیم‌کش از بالا',about:'یک صندلی با پد نگهدارنده ران و یک کابل از بالای سر دارد. برای کشش عمودی عضلات لت استفاده می‌شود.',setup:['پد ران را پایین بیاور تا پاها محکم زیر آن بمانند ولی درد ایجاد نکند.','دسته خنثی یا V را وصل کن و طوری بنشین که کابل تقریباً بالای سرت باشد.','سینه را بالا نگه دار و فقط کمی، حدود ۱۰ تا ۱۵ درجه، به عقب متمایل شو.'],check:'وزنه‌ای انتخاب کن که بتوانی بدون تکان دادن تنه، دسته را تا بالای سینه پایین بیاوری.'},
  chestPress:{en:'Chest Press Machine',fa:'دستگاه پرس سینه',about:'صندلی و پشتی دارد و دسته‌ها از کنار سینه به جلو حرکت می‌کنند؛ ممکن است وزنه پینی یا صفحه‌ای باشد.',setup:['ارتفاع صندلی را طوری بگذار که دسته‌ها هم‌سطح وسط سینه باشند.','کمر و کتف‌ها را روی پشتی نگه دار و پاها را کامل روی زمین بگذار.','اگر دستگاه تنظیم نقطه شروع دارد، دسته‌ها را آن‌قدر عقب نبر که جلوی شانه کشش ناخوشایند بگیرد.'],check:'در انتهای پرس شانه‌ها نباید از پشتی جدا یا به جلو گرد شوند.'},
  cableLateral:{en:'Cable Station',fa:'دستگاه سیم‌کش',about:'ستون وزنه و قرقره قابل‌تنظیم دارد. در نشر جانب، قرقره در پایین‌ترین ارتفاع قرار می‌گیرد.',setup:['قرقره را در پایین‌ترین نقطه بگذار و یک دستگیره تکی وصل کن.','کنار دستگاه بایست و با دست دورتر از دستگاه دستگیره را بگیر.','یک قدم فاصله بگیر تا حتی در پایین حرکت هم کابل کمی کشش داشته باشد.'],check:'اگر برای بالا بردن دست مجبور به تاب دادن بدن یا بالا انداختن شانه می‌شوی، وزنه زیاد است.'},
  reversePecDeck:{en:'Reverse Pec Deck',fa:'دستگاه فلای معکوس / نشر خم',about:'همان دستگاه پک‌دک است که دسته‌ها برای حرکت رو به عقب تنظیم می‌شوند؛ سینه به پد تکیه می‌کند.',setup:['صندلی را طوری تنظیم کن که دسته‌ها تقریباً هم‌سطح شانه باشند.','رو به پد بنشین و سینه را به آن بچسبان.','تنظیم شروع دسته‌ها را طوری بگذار که دست‌ها جلوی بدن باشند ولی شانه‌ها بیش از حد کشیده نشوند.'],check:'حرکت را با آرنج‌ها باز کن؛ هدف بردن دست‌ها به بیرون است، نه جمع کردن شدید کتف‌ها.'},
  tricepsCable:{en:'Cable Station + Rope',fa:'دستگاه سیم‌کش با طناب',about:'برای پشت بازو طناب به قرقره بالایی وصل می‌شود و مقاومت از بالا به پایین می‌آید.',setup:['قرقره را در بالاترین نقطه بگذار و طناب را وصل کن.','نزدیک دستگاه بایست و آرنج‌ها را کنار بدن ثابت کن.','قبل از شروع، کابل باید کشش داشته باشد و وزنه‌ها روی هم نخوابیده باشند.'],check:'اگر آرنج‌ها جلو و عقب می‌روند یا شانه‌ها کمک می‌کنند، وزنه را کم کن.'},
  hackSquat:{en:'Hack Squat Machine',fa:'دستگاه هک اسکوات',about:'پشتی شیب‌دار، پدهای روی شانه و صفحه بزرگ زیر پا دارد و کالسکه روی ریل حرکت می‌کند.',setup:['کمر و لگن را کامل روی پشتی بگذار و شانه‌ها را زیر پدها قرار بده.','پاها را تقریباً عرض شانه در میانه صفحه بگذار؛ پنجه و زانو در یک جهت باشند.','قبل از پایین رفتن، اهرم‌های ایمنی را آزاد کن و محل قفل مجددشان را بشناس.'],check:'عمق فقط تا جایی باشد که پاشنه‌ها روی صفحه بمانند و کمر از پشتی جدا نشود.'},
  seatedLegCurl:{en:'Seated Leg Curl Machine',fa:'دستگاه پشت پا نشسته',about:'صندلی، پد روی ران و رول پشت مچ دارد؛ زانوها خم می‌شوند و همسترینگ کار می‌کند.',setup:['زانو را دقیقاً نزدیک محور چرخش دستگاه قرار بده.','رول پایین را کمی بالاتر از پاشنه، پشت ساق تنظیم کن.','پد ران را محکم ولی راحت روی ران‌ها قفل کن تا لگن بلند نشود.'],check:'اگر زانو جلو یا عقب محور دستگاه است، قبل از وزنه زدن صندلی را تنظیم کن.'},
  standingCalf:{en:'Standing Calf Raise Machine',fa:'دستگاه ساق پا ایستاده',about:'پدهای شانه و لبه‌ای برای قرار دادن پنجه پا دارد؛ زانو تقریباً صاف می‌ماند.',setup:['ارتفاع پد شانه را طوری تنظیم کن که در حالت ایستاده کمی زانو خم باشد.','فقط سینه پا را روی لبه بگذار و پاشنه آزاد باشد.','بعد از گرفتن تعادل، قفل دستگاه را آزاد کن.'],check:'در پایین حرکت ۱ تا ۲ ثانیه کشش بگیر و از جهش با تاندون آشیل استفاده نکن.'},
  assistedPullup:{en:'Assisted Pull-Up / Dip Machine',fa:'دستگاه بارفیکس کمکی',about:'یک پد زانو یا سکوی متحرک دارد که بخشی از وزن بدن را جبران می‌کند. در این دستگاه عدد بیشتر یعنی کمک بیشتر.',setup:['وزنه کمکی را طوری انتخاب کن که بتوانی ۶ تا ۱۰ تکرار تمیز انجام بدهی.','با کنترل روی پد زانو قرار بگیر و دسته بارفیکس را کمی بازتر از شانه بگیر.','از آویزان کامل شروع کن و بدن را بدون تاب دادن بالا بکش.'],check:'برای پیشرفت، به‌مرور مقدار کمک را کمتر کن؛ کاهش عدد کمک یعنی قوی‌تر شده‌ای.'},
  seatedCableRow:{en:'Seated Cable Row',fa:'دستگاه قایقی سیم‌کش نشسته',about:'کابل افقی، جای پا و معمولاً دسته V دارد. مسیر کشش به سمت پایین شکم است.',setup:['پاها را روی صفحه بگذار و زانوها را کمی خم نگه دار.','دسته خنثی را بگیر و آن‌قدر عقب بنشین که کابل در شروع کشش داشته باشد.','ستون فقرات را خنثی و سینه را بالا نگه دار.'],check:'کمی حرکت تنه طبیعی است، ولی اگر برای هر تکرار به عقب پرتاب می‌شوی وزنه زیاد است.'},
  shoulderPress:{en:'Shoulder Press Machine',fa:'دستگاه پرس سرشانه',about:'صندلی و پشتی عمودی دارد و دسته‌ها از کنار شانه به بالای سر حرکت می‌کنند.',setup:['صندلی را طوری تنظیم کن که دسته‌ها حدود ارتفاع چانه تا شانه باشند.','کمر و پشت سر را در وضعیت راحت روی پشتی نگه دار.','مچ‌ها را بالای آرنج‌ها نگه دار و دسته مناسب و راحت را انتخاب کن.'],check:'اگر برای پرس مجبور می‌شوی کمر را زیاد قوس بدهی، وزن یا ارتفاع صندلی را اصلاح کن.'},
  lowHighCable:{en:'Dual Adjustable Cable / Crossover',fa:'دستگاه کراس‌اور سیم‌کش',about:'دو ستون کابل روبه‌روی هم دارد. برای فلای پایین به بالا هر دو قرقره در پایین تنظیم می‌شوند.',setup:['هر دو قرقره را در پایین‌ترین ارتفاع بگذار و دو دستگیره تکی وصل کن.','یک قدم جلو برو و پاها را یکی جلو یکی عقب قرار بده.','آرنج‌ها کمی خم و ثابت بمانند و دست‌ها از پایین به سمت بالای سینه حرکت کنند.'],check:'وزنه باید آن‌قدر سبک باشد که حرکت شبیه بغل کردن باشد، نه پرس کردن.'},
  rearDeltCable:{en:'Cable Crossover / Reverse Pec Deck',fa:'کراس‌اور سیم‌کش / فلای معکوس',about:'این حرکت را می‌توان با دو کابل در ارتفاع شانه یا با پک‌دک معکوس انجام داد؛ هر دو روی پشت شانه تمرکز دارند.',setup:['برای کابل، هر دو قرقره را تقریباً هم‌ارتفاع شانه قرار بده و کابل‌ها را ضربدری بگیر.','برای پک‌دک، رو به پد بنشین و دسته‌ها را هم‌سطح شانه تنظیم کن.','در هر دو حالت آرنج کمی خم و زاویه آن تقریباً ثابت باشد.'],check:'با وزنه سبک شروع کن؛ اگر حرکت تبدیل به روئینگ شد و آرنج خیلی عقب رفت، هدف از دلتوئید خلفی دور می‌شود.'},
  overheadCable:{en:'Cable Station',fa:'دستگاه سیم‌کش برای پشت بازو بالای سر',about:'طناب به قرقره پایین یا میانی وصل می‌شود و رو به بیرون از دستگاه، آرنج بالای سر باز و بسته می‌شود.',setup:['طناب را به قرقره پایین یا میانی وصل کن و پشت به دستگاه بایست.','یک پای خود را جلو بگذار و کمی از لگن به جلو متمایل شو.','آرنج‌ها را نزدیک سر نگه دار و اجازه بده پشت بازو در پایین حرکت کشیده شود.'],check:'اگر آرنج‌ها خیلی باز می‌شوند یا کمر را قوس می‌دهی، وزن را کم کن.'},
  preacher:{en:'Preacher Curl Machine / Bench',fa:'دستگاه یا میز جلو بازو لاری',about:'بازوها روی یک پد شیب‌دار قرار می‌گیرند تا حرکت شانه کم شود. بعضی مدل‌ها وزنه پینی دارند و بعضی با EZ-bar استفاده می‌شوند.',setup:['ارتفاع صندلی را طوری تنظیم کن که زیر بغل نزدیک لبه بالای پد باشد.','تمام پشت بازو را روی پد نگه دار و مچ را در امتداد ساعد قرار بده.','در پایین حرکت آرنج را با ضربه قفل نکن.'],check:'اگر برای بالا آوردن وزنه شانه از پد جدا می‌شود، وزنه زیاد است.'},
  legPress:{en:'45° Leg Press',fa:'دستگاه پرس پا',about:'صندلی یا پشتی شیب‌دار و صفحه بزرگی برای پا دارد؛ با خم و صاف کردن زانو و لگن صفحه یا صندلی حرکت می‌کند.',setup:['پاها را تقریباً عرض شانه در میانه صفحه قرار بده.','کمر و لگن را کاملاً به پشتی بچسبان و اهرم‌های ایمنی را بشناس.','پایین برو تا جایی که زانوها خوب خم شوند ولی لگن از پشتی جمع نشود.'],check:'زانوها در مسیر پنجه‌ها حرکت کنند و در بالا به قفل شدید زانو نکوب.'},
  lyingLegCurl:{en:'Lying Leg Curl Machine',fa:'دستگاه پشت پا خوابیده',about:'روی شکم دراز می‌کشی و رول پشت ساق را با خم کردن زانو به سمت باسن می‌آوری.',setup:['زانوها را نزدیک لبه یا محور چرخش دستگاه قرار بده.','رول را کمی بالاتر از پاشنه تنظیم کن.','لگن را روی پد نگه دار و دسته‌ها را بگیر.'],check:'اگر لگن از پد بلند می‌شود یا کمر قوس می‌گیرد، وزنه را کمتر کن.'},
  backExtension:{en:'45° Back Extension Bench',fa:'نیمکت فیله کمر ۴۵ درجه',about:'یک پد برای لگن و رول برای قفل شدن مچ/پاشنه دارد. دستگاه وزنه‌ای نیست، اما تنظیم درست آن برای حرکت مهم است.',setup:['لبه پد را کمی پایین‌تر از خط لگن تنظیم کن تا بتوانی از مفصل ران خم شوی.','پاشنه و مچ را زیر رول‌ها محکم کن.','بدن را از سر تا لگن یکپارچه نگه دار و از لگن خم شو.'],check:'بالا آمدن را در خط صاف بدن متوقف کن؛ بیش از حد به عقب خم نشو.'},
  seatedCalf:{en:'Seated Calf Raise Machine',fa:'دستگاه ساق پا نشسته',about:'پد روی ران‌ها قرار می‌گیرد و پنجه پا روی لبه است؛ زانوی خم‌شده سهم عضله سولئوس را بیشتر می‌کند.',setup:['پد ران را طوری پایین بیاور که محکم روی بخش پایینی ران قرار بگیرد.','سینه پا را روی لبه بگذار و پاشنه را آزاد نگه دار.','با بالا بردن پاشنه قفل ایمنی را آزاد کن و سپس دامنه کامل را اجرا کن.'],check:'در پایین هر تکرار مکث کوتاه داشته باش و حرکت را با جهش انجام نده.'}
};

const EXTRAS={
  inclineSmith:{fa:'پرس بالا سینه اسمیت',guide:'smithIncline',machine:{name:'Incline Chest Press Machine',fa:'پرس بالا سینه دستگاه',equipment:'Incline chest press machine',cue:'Keep the press angle upward and the handles aimed toward the upper chest.'},free:{name:'Incline Dumbbell Press',fa:'پرس بالا سینه دمبل',equipment:'Dumbbells + adjustable bench',cue:'Set the bench around 30° and use the same controlled press pattern.'}},
  chestRow:{fa:'زیربغل قایقی سینه‌تکیه‌دار',guide:'chestRow',machine:{name:'Seated Row Machine',fa:'قایقی دستگاه',equipment:'Selectorized or plate-loaded row',cue:'Use a neutral or medium grip and pull toward the lower ribs.'},free:{name:'Incline-Bench Dumbbell Row',fa:'قایقی دمبل روی میز شیب‌دار',equipment:'Dumbbells + incline bench',cue:'Lie chest-down on the bench so the torso stays supported.'}},
  latPulldown:{fa:'لت سیم‌کش دست خنثی',guide:'latPulldown',machine:{name:'Assisted Pull-Up Machine',fa:'بارفیکس کمکی دستگاه',equipment:'Assisted pull-up machine',cue:'Use enough assistance to stay in the programmed rep range.'},free:{name:'Pull-Up / Negative Pull-Up',fa:'بارفیکس / بارفیکس منفی',equipment:'Pull-up bar / bodyweight',cue:'Use full hangs; if full reps are not available, do slow controlled negatives.'}},
  machineChest:{fa:'پرس سینه دستگاه',guide:'chestPress',machine:{name:'Plate-Loaded Chest Press',fa:'پرس سینه صفحه‌ای',equipment:'Plate-loaded chest press',cue:'Match the handle height to mid-chest and keep the shoulder blades supported.'},free:{name:'Flat Dumbbell Bench Press',fa:'پرس سینه دمبل تخت',equipment:'Dumbbells + flat bench',cue:'Keep elbows around 45° from the torso and control the bottom stretch.'}},
  cableLateral:{fa:'نشر جانب سیم‌کش',guide:'cableLateral',machine:{name:'Lateral Raise Machine',fa:'دستگاه نشر جانب',equipment:'Lateral raise machine',cue:'Place the pads just above the elbows and raise to about shoulder height.'},free:{name:'Dumbbell Lateral Raise',fa:'نشر جانب دمبل',equipment:'Dumbbells',cue:'Use light dumbbells, a soft elbow, and no shrugging or swinging.'}},
  reversePecDeck:{fa:'فلای معکوس دستگاه',guide:'reversePecDeck',machine:{name:'Cable Rear-Delt Fly',fa:'نشر خم سیم‌کش',equipment:'Dual cable station',cue:'Set the pulleys around shoulder height and open the arms wide.'},free:{name:'Bent-Over Dumbbell Reverse Fly',fa:'نشر خم دمبل',equipment:'Dumbbells',cue:'Hinge forward, keep the torso still, and raise the arms out wide.'}},
  ropePushdown:{fa:'پشت بازو سیم‌کش طناب',guide:'tricepsCable',machine:{name:'Triceps Dip / Press Machine',fa:'دستگاه دیپ یا پرس پشت بازو',equipment:'Triceps press / assisted dip machine',cue:'Keep the torso controlled and finish by fully extending the elbows.'},free:{name:'Dumbbell Skull Crusher',fa:'پشت بازو خوابیده دمبل',equipment:'Dumbbells + bench',cue:'Keep upper arms mostly fixed and bend only at the elbows.'}},
  inclineCurl:{fa:'جلو بازو دمبل روی میز شیب‌دار',machine:{name:'Biceps Curl Machine',fa:'دستگاه جلو بازو',equipment:'Biceps curl machine',cue:'Align the elbows with the machine pivot and keep the upper arms supported.'},free:{name:'Standing Dumbbell Curl',fa:'جلو بازو دمبل ایستاده',equipment:'Dumbbells',cue:'Keep elbows close to the torso and avoid swinging.'}},
  hackSquat:{fa:'هک اسکوات',guide:'hackSquat',machine:{name:'45° Leg Press',fa:'پرس پا ۴۵ درجه',equipment:'Leg press machine',cue:'Use a mid-foot position and let the knees travel naturally over the toes.'},free:{name:'Goblet Squat',fa:'گابلت اسکوات',equipment:'One dumbbell',cue:'Hold one dumbbell at the chest and squat as deep as you can with heels down.'}},
  rdl:{fa:'ددلیفت رومانیایی',machine:{name:'Smith Machine RDL',fa:'ددلیفت رومانیایی اسمیت',equipment:'Smith machine',cue:'Keep the bar close and push the hips back; the knees only soften slightly.'},free:{name:'Dumbbell Romanian Deadlift',fa:'ددلیفت رومانیایی دمبل',equipment:'Dumbbells',cue:'Use the same hip hinge and stop when the hamstrings are strongly stretched.'}},
  bulgarian:{fa:'اسکوات بلغاری',machine:{name:'Single-Leg Press',fa:'پرس پا تک پا',equipment:'Leg press machine',cue:'Place one foot centrally and use a controlled depth without the pelvis twisting.'},free:{name:'Dumbbell Reverse Lunge',fa:'لانج معکوس دمبل',equipment:'Dumbbells / bodyweight',cue:'Step backward and keep most of the load on the front leg.'}},
  seatedLegCurl:{fa:'پشت پا نشسته',guide:'seatedLegCurl',machine:{name:'Lying Leg Curl',fa:'پشت پا خوابیده دستگاه',equipment:'Lying leg curl machine',cue:'Keep the hips down and curl the heels toward the glutes.'},free:{name:'Hamstring Walkout',fa:'واک‌اوت همسترینگ با وزن بدن',equipment:'Bodyweight',cue:'Bridge the hips up and slowly walk the heels away and back.'}},
  standingCalf:{fa:'ساق پا ایستاده',guide:'standingCalf',machine:{name:'Leg Press Calf Raise',fa:'ساق پا روی دستگاه پرس پا',equipment:'Leg press machine',cue:'Keep the knees nearly straight and move only through the ankles.'},free:{name:'Single-Leg Standing Calf Raise',fa:'ساق تک پا ایستاده',equipment:'Bodyweight or one dumbbell',cue:'Use a step for a deep stretch and hold a dumbbell when bodyweight is easy.'}},
  pullUp:{fa:'بارفیکس / بارفیکس کمکی',guide:'assistedPullup',machine:{name:'Neutral-Grip Lat Pulldown',fa:'لت سیم‌کش دست خنثی',equipment:'Lat pulldown machine',cue:'Drive the elbows down toward the ribs and control the full stretch.'},free:{name:'Bodyweight Pull-Up / Negative',fa:'بارفیکس وزن بدن / منفی',equipment:'Pull-up bar',cue:'Use clean bodyweight reps or slow 3–5 second negatives.'}},
  dbBench:{fa:'پرس سینه دمبل تخت',machine:{name:'Chest Press Machine',fa:'پرس سینه دستگاه',equipment:'Chest press machine',cue:'Set the handles at mid-chest and press without rolling the shoulders forward.'},free:{name:'Barbell Bench Press',fa:'پرس سینه هالتر',equipment:'Barbell + bench',cue:'Use a stable setup, shoulder blades back, and a controlled touch on the chest.'}},
  seatedRow:{fa:'قایقی سیم‌کش نشسته',guide:'seatedCableRow',machine:{name:'Chest-Supported Row Machine',fa:'قایقی سینه‌تکیه‌دار دستگاه',equipment:'Chest-supported row machine',cue:'Keep the chest on the pad and pull toward the lower ribs.'},free:{name:'One-Arm Dumbbell Row',fa:'قایقی تک دمبل',equipment:'Dumbbell + bench',cue:'Support yourself on a bench and pull the elbow toward the hip.'}},
  machineShoulder:{fa:'پرس سرشانه دستگاه',guide:'shoulderPress',machine:{name:'Plate-Loaded Shoulder Press',fa:'پرس سرشانه صفحه‌ای',equipment:'Plate-loaded shoulder press',cue:'Set the seat so the handles start near shoulder or chin height.'},free:{name:'Seated Dumbbell Shoulder Press',fa:'پرس سرشانه دمبل نشسته',equipment:'Dumbbells + bench',cue:'Use a back-supported bench and keep wrists stacked over elbows.'}},
  lowHighFly:{fa:'فلای سیم‌کش از پایین به بالا',guide:'lowHighCable',machine:{name:'Incline Chest Press Machine',fa:'پرس بالا سینه دستگاه',equipment:'Incline chest press machine',cue:'Not identical, but it preserves the upper-chest emphasis when cables are unavailable.'},free:{name:'Incline Dumbbell Fly',fa:'فلای بالا سینه دمبل',equipment:'Dumbbells + incline bench',cue:'Use a light load, fixed soft elbows, and a wide controlled arc.'}},
  rearDeltFly:{fa:'نشر خم سیم‌کش / فلای معکوس',guide:'rearDeltCable',machine:{name:'Reverse Pec Deck',fa:'فلای معکوس دستگاه',equipment:'Reverse pec deck',cue:'Set the handles around shoulder height and open the arms wide.'},free:{name:'Bent-Over Dumbbell Rear-Delt Fly',fa:'نشر خم دمبل',equipment:'Dumbbells',cue:'Hinge forward and raise the arms out to the sides without rowing.'}},
  overheadExt:{fa:'پشت بازو سیم‌کش بالای سر',guide:'overheadCable',machine:{name:'Seated Triceps Extension Machine',fa:'دستگاه پشت بازو نشسته',equipment:'Triceps extension machine',cue:'Keep the upper arms stable and work through a comfortable elbow range.'},free:{name:'One-Dumbbell Overhead Extension',fa:'پشت بازو دمبل بالای سر',equipment:'One dumbbell',cue:'Hold one dumbbell with both hands and keep the elbows pointing forward.'}},
  preacherCurl:{fa:'جلو بازو لاری',guide:'preacher',machine:{name:'Biceps Curl Machine',fa:'دستگاه جلو بازو',equipment:'Selectorized biceps curl machine',cue:'Align the elbow with the pivot and keep the upper arm on the pad.'},free:{name:'Standing EZ-Bar Curl',fa:'جلو بازو هالتر EZ ایستاده',equipment:'EZ-bar',cue:'Keep the torso quiet and elbows close to your sides.'}},
  hipThrust:{fa:'هیپ تراست',machine:{name:'Glute Drive / Hip Thrust Machine',fa:'دستگاه هیپ تراست / گلوت درایو',equipment:'Glute drive machine',cue:'Set the belt or pad across the hips and finish with ribs down, not a low-back arch.'},free:{name:'Dumbbell Glute Bridge',fa:'گلوت بریج دمبل',equipment:'Dumbbell + floor/bench',cue:'Place the dumbbell across the hips and squeeze the glutes at full hip extension.'}},
  legPress:{fa:'پرس پا',guide:'legPress',machine:{name:'Hack Squat Machine',fa:'هک اسکوات دستگاه',equipment:'Hack squat machine',cue:'Keep the back on the pad and use a controlled squat depth.'},free:{name:'Goblet Squat',fa:'گابلت اسکوات',equipment:'One dumbbell',cue:'Hold the dumbbell at the chest and use the deepest stable squat you can control.'}},
  lyingLegCurl:{fa:'پشت پا خوابیده',guide:'lyingLegCurl',machine:{name:'Seated Leg Curl',fa:'پشت پا نشسته دستگاه',equipment:'Seated leg curl machine',cue:'Align the knees with the pivot and keep the thigh pad snug.'},free:{name:'Hamstring Walkout',fa:'واک‌اوت همسترینگ با وزن بدن',equipment:'Bodyweight',cue:'Keep the hips lifted while walking the heels away and back.'}},
  backExt:{fa:'فیله کمر ۴۵ درجه',guide:'backExtension',machine:{name:'Back Extension Machine',fa:'دستگاه فیله کمر / اکستنشن کمر',equipment:'Back extension machine',cue:'Move through the hips and stop when the torso reaches a straight line.'},free:{name:'Dumbbell Romanian Deadlift',fa:'ددلیفت رومانیایی دمبل',equipment:'Dumbbells',cue:'Use a hip hinge with a neutral spine and a strong hamstring stretch.'}},
  seatedCalf:{fa:'ساق پا نشسته',guide:'seatedCalf',machine:{name:'Standing Calf Raise Machine',fa:'دستگاه ساق پا ایستاده',equipment:'Standing calf raise machine',cue:'This shifts some emphasis toward gastrocnemius but still trains the calves well.'},free:{name:'Single-Leg Calf Raise',fa:'ساق تک پا',equipment:'Bodyweight or one dumbbell',cue:'Use a step for range of motion and add a dumbbell when needed.'}}
};


const VARIANT_KEYS=['primary','machine','free'];
const VARIANT_META={
  primary:{label:'Primary',short:'Primary',sub:'Programmed'},
  machine:{label:'Machine alternative',short:'Machine',sub:'Alternate machine'},
  free:{label:'Free-weight fallback',short:'Free weight',sub:'Dumbbell / barbell / bodyweight'}
};

Object.assign(MACHINE_GUIDES,{
  inclineChestPress:{en:'Incline Chest Press Machine',fa:'دستگاه پرس بالا سینه',about:'صندلی و پشتی شیب‌دار دارد و دسته‌ها در مسیر مایل رو به بالا حرکت می‌کنند؛ هدف اصلی بخش بالایی سینه است.',setup:['صندلی را طوری تنظیم کن که دسته‌ها تقریباً هم‌سطح بالای سینه باشند.','کتف‌ها را به پشتی بچسبان و پاها را محکم روی زمین بگذار.','نقطه شروع را آن‌قدر عقب نبر که جلوی شانه کشش تیز یا ناراحت‌کننده بگیرد.'],check:'در تمام تکرارها مسیر دسته‌ها باید به سمت بالای سینه باشد و شانه‌ها از پشتی جدا نشوند.'},
  seatedRowMachine:{en:'Seated Row Machine',fa:'دستگاه قایقی نشسته',about:'صندلی و دسته‌های افقی دارد و معمولاً بدون کابل آزاد، روی یک مسیر ثابت یا نیمه‌آزاد کار می‌کند.',setup:['ارتفاع صندلی را طوری تنظیم کن که دسته‌ها مقابل پایین سینه یا دنده‌ها قرار بگیرند.','اگر پد سینه دارد، سینه را کامل روی آن نگه دار.','دسته خنثی یا متوسط را انتخاب کن و در شروع اجازه بده دست‌ها کامل کشیده شوند.'],check:'اگر برای کشیدن دسته‌ها مجبور می‌شوی تنه را عقب پرت کنی، وزنه زیاد است.'},
  lateralRaiseMachine:{en:'Lateral Raise Machine',fa:'دستگاه نشر جانب',about:'پدها معمولاً روی بیرون بازو یا نزدیک آرنج قرار می‌گیرند و حرکت بازوها را به طرفین هدایت می‌کنند.',setup:['صندلی را طوری تنظیم کن که محور شانه تقریباً با محور دستگاه هم‌سطح باشد.','پدها را کمی بالاتر از آرنج قرار بده و آرنج‌ها را نرم نگه دار.','از پایین حرکت بدون بالا انداختن شانه‌ها شروع کن.'],check:'بازوها را فقط تا حدود ارتفاع شانه بالا ببر؛ شراگ کردن یعنی وزنه بیش از حد سنگین است.'},
  tricepsPressMachine:{en:'Dip / Triceps Press Machine',fa:'دستگاه دیپ یا پرس پشت بازو',about:'در حالت نشسته دسته‌ها را به سمت پایین فشار می‌دهی و بخش عمده کار روی پشت بازو است.',setup:['صندلی را طوری تنظیم کن که آرنج‌ها در شروع حدود ۹۰ درجه باشند.','سینه را بالا و شانه‌ها را پایین نگه دار و دسته‌ها را محکم بگیر.','اگر کمربند یا پد نگهدارنده دارد، آن را طوری ببند که لگن از صندلی بلند نشود.'],check:'برای تأکید بیشتر روی پشت بازو، آرنج‌ها را نزدیک بدن نگه دار و با شانه فشار نده.'},
  bicepsCurlMachine:{en:'Biceps Curl Machine',fa:'دستگاه جلو بازو',about:'بازوها روی پد قرار می‌گیرند و محور دستگاه نزدیک آرنج است تا حرکت شانه محدود شود.',setup:['ارتفاع صندلی را طوری تنظیم کن که آرنج‌ها با محور چرخش دستگاه هم‌راستا باشند.','پشت بازو را کامل روی پد نگه دار و مچ را خنثی نگه دار.','دامنه را از نزدیک صاف شدن آرنج تا انقباض کامل ولی بدون جمع شدن شانه انجام بده.'],check:'اگر شانه‌ها از پد جدا می‌شوند یا بدن عقب می‌رود، وزنه را کم کن.'},
  smithRdl:{en:'Smith Machine',fa:'دستگاه اسمیت',about:'میله روی ریل ثابت حرکت می‌کند و برای RDL امکان کنترل مسیر و تمرکز روی هیپ‌هینج را می‌دهد.',setup:['پاها را کمی جلوتر از خط میله قرار بده تا میله هنگام پایین رفتن نزدیک ران و ساق بماند.','زانوها را کمی خم و زاویه‌شان را تقریباً ثابت نگه دار.','قبل از شروع، قفل‌های ایمنی را در ارتفاع مناسب تنظیم کن.'],check:'حرکت باید از عقب بردن لگن بیاید؛ اگر زانو زیاد خم می‌شود، حرکت دارد شبیه اسکوات می‌شود.'},
  singleLegPress:{en:'Leg Press Machine',fa:'دستگاه پرس پا تک پا',about:'همان دستگاه پرس پا است اما یک پا در مرکز صفحه قرار می‌گیرد و هر سمت جدا تمرین می‌شود.',setup:['یک پا را تقریباً وسط صفحه بگذار و پای دیگر را از مسیر حرکت خارج نگه دار.','لگن و کمر را کامل روی پشتی نگه دار.','دامنه را تا جایی پایین بیاور که لگن نچرخد و کمر گرد نشود.'],check:'زانو باید در راستای پنجه همان پا حرکت کند؛ اگر لگن می‌چرخد دامنه را کمتر کن.'},
  legPressCalf:{en:'Leg Press Machine',fa:'پرس پا برای ساق',about:'روی دستگاه پرس پا فقط پنجه‌ها روی لبه صفحه قرار می‌گیرند و حرکت از مچ پا انجام می‌شود.',setup:['پاها را تقریباً عرض لگن بگذار و فقط سینه پا را روی لبه پایین صفحه قرار بده.','زانوها را صاف ولی قفل‌نشده نگه دار.','قبل از شروع مطمئن شو صفحه در وضعیت ایمن و کنترل‌شده است.'],check:'پاشنه را پایین ببر تا کشش ساق حس شود و سپس تا آخرین دامنه روی پنجه فشار بده؛ زانو نباید پمپ کند.'},
  tricepsExtensionMachine:{en:'Triceps Extension Machine',fa:'دستگاه پشت بازو نشسته',about:'بازوها روی پد یا تکیه‌گاه قرار می‌گیرند و با صاف کردن آرنج، پشت بازو کار می‌کند.',setup:['ارتفاع صندلی را طوری تنظیم کن که آرنج‌ها راحت روی پد یا نزدیک محور دستگاه قرار بگیرند.','شانه‌ها را پایین نگه دار و تنه را ثابت کن.','دامنه شروع را طوری انتخاب کن که کشش پشت بازو بدون فشار ناخوشایند به آرنج باشد.'],check:'فقط آرنج باز و بسته شود؛ اگر شانه یا تنه حرکت می‌کند وزنه زیاد است.'},
  gluteDrive:{en:'Glute Drive / Hip Thrust Machine',fa:'دستگاه گلوت درایو / هیپ تراست',about:'پد یا کمربند روی لگن قرار می‌گیرد و مسیر دستگاه برای اکستنشن مفصل ران طراحی شده است.',setup:['پشت بالایی را روی پد قرار بده و پاها را طوری تنظیم کن که در بالای حرکت ساق‌ها تقریباً عمودی باشند.','پد یا کمربند را روی قسمت استخوانی لگن محکم کن، نه روی شکم.','چانه را کمی جمع و دنده‌ها را پایین نگه دار.'],check:'بالای حرکت بدن باید تقریباً خط صاف بسازد؛ با قوس زیاد کمر دامنه اضافه نگیر.'},
  backExtensionMachine:{en:'Back Extension Machine',fa:'دستگاه اکستنشن کمر / فیله',about:'در حالت نشسته یا نیمه‌نشسته، پد پشت تنه قرار می‌گیرد و با باز کردن مفصل ران و تنه به عقب فشار می‌دهی.',setup:['محور دستگاه را نزدیک مفصل لگن یا مطابق راهنمای دستگاه تنظیم کن.','پد را روی قسمت بالایی پشت قرار بده و پاها را محکم روی تکیه‌گاه بگذار.','با دامنه کوتاه و سبک شروع کن تا مسیر دستگاه را پیدا کنی.'],check:'در انتهای حرکت از خط صاف بدن عبور نکن و کمر را بیش از حد به عقب خم نکن.'}
});

const ALT_DETAILS={
  inclineSmith:{
    machine:{guide:'inclineChestPress',img:['Leverage_Incline_Chest_Press','Machine_Bench_Press'],yt:'incline chest press machine proper form',steps:['Set the seat so the handles start around upper-chest level.','Pin your upper back to the pad and press the handles up and slightly forward.','Lower under control until you feel a chest stretch without the shoulders rolling forward.'],tips:['Keep your shoulder blades supported throughout.','Use the same 30–45° upper-chest pressing intent as the primary movement.']},
    free:{img:['Incline_Dumbbell_Press','Dumbbell_Bench_Press'],yt:'incline dumbbell press proper form',steps:['Set an adjustable bench to about 30°.','Kick the dumbbells into position, retract the shoulder blades and plant your feet.','Lower the dumbbells to the upper-chest line, then press up and slightly inward.'],tips:['Keep elbows roughly 45–60° from your torso.','Control the bottom stretch; do not bounce.']}
  },
  chestRow:{
    machine:{guide:'seatedRowMachine',img:['Seated_Cable_Rows','Lying_T-Bar_Row'],yt:'seated row machine proper form',steps:['Adjust the seat so the handles line up with your lower ribs.','Keep your chest against the pad if the machine has one.','Pull the elbows back, pause briefly, then return to a full stretch.'],tips:['Do not turn it into a torso swing.','Think elbows toward your back pockets.']},
    free:{img:['Dumbbell_Incline_Row','Bent_Over_Two-Dumbbell_Row'],yt:'chest supported dumbbell row incline bench form',steps:['Set an incline bench around 30–45° and lie chest-down.','Let both dumbbells hang with the shoulders relaxed.','Row toward the lower ribs, pause, then lower to a full stretch.'],tips:['Keep the chest glued to the bench.','Do not shrug the shoulders toward the ears.']}
  },
  latPulldown:{machine:{reuse:'pullUp',guide:'assistedPullup',assist:true,loadMode:'assist',yt:'assisted pull up machine proper form'},free:{reuse:'pullUp',guide:null,loadMode:'bodyweight',assist:false,yt:'bodyweight pull up proper form'}},
  machineChest:{machine:{reuse:'machineChest',guide:'chestPress',img:['Leverage_Chest_Press','Machine_Bench_Press'],yt:'plate loaded chest press proper form'},free:{reuse:'dbBench',guide:null,yt:'flat dumbbell bench press proper form'}},
  cableLateral:{
    machine:{guide:'lateralRaiseMachine',img:['Seated_Side_Lateral_Raise','Side_Lateral_Raise'],yt:'lateral raise machine proper form',steps:['Adjust the seat so your shoulders line up naturally with the machine.','Place the pads near the outside of the elbows and keep a soft elbow bend.','Raise to about shoulder height, then lower slowly.'],tips:['Keep the traps relaxed.','Use a load you can move without momentum.']},
    free:{img:['Side_Lateral_Raise','One-Arm_Incline_Lateral_Raise'],yt:'dumbbell lateral raise proper form',steps:['Stand tall with light dumbbells at your sides.','Keep a small fixed elbow bend and raise the arms out to the sides.','Stop around shoulder height and lower slowly.'],tips:['Lead with the elbows, not the hands.','No swinging or shrugging.']}
  },
  reversePecDeck:{machine:{reuse:'rearDeltFly',guide:'rearDeltCable',yt:'cable rear delt fly proper form'},free:{img:['Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench','Dumbbell_Lying_Rear_Lateral_Raise'],yt:'bent over dumbbell rear delt fly proper form',steps:['Hinge forward with a flat, stable torso.','Hold light dumbbells with soft elbows and raise the arms out wide.','Stop when the upper arms are roughly in line with the torso, then lower slowly.'],tips:['Do not row the dumbbells toward the ribs.','Keep the neck relaxed and movement smooth.']}},
  ropePushdown:{
    machine:{guide:'tricepsPressMachine',img:['Dip_Machine','Triceps_Pushdown'],yt:'dip machine triceps proper form',steps:['Sit securely and grip the handles with elbows close to your sides.','Press the handles down by straightening the elbows.','Return under control until the elbows are comfortably bent.'],tips:['Keep the shoulders down and torso stable.','Finish with the triceps, not a bodyweight shove.']},
    free:{img:['Decline_Dumbbell_Triceps_Extension','Standing_Dumbbell_Triceps_Extension'],yt:'dumbbell skull crusher proper form',steps:['Lie on a bench with dumbbells over the shoulders.','Keep the upper arms mostly fixed and bend the elbows to lower the dumbbells beside the head.','Extend the elbows to return without letting them flare wide.'],tips:['Use a light-to-moderate load and slow lowering.','Stop if the elbows feel pinched or painful.']}
  },
  inclineCurl:{
    machine:{guide:'bicepsCurlMachine',img:['Machine_Preacher_Curls','Preacher_Curl'],yt:'biceps curl machine proper form',steps:['Adjust the seat so the elbows align with the machine pivot.','Keep the upper arms supported and curl through a comfortable range.','Lower slowly until the elbows are nearly straight.'],tips:['Do not lift the shoulders off the pad.','Keep the wrist stacked with the forearm.']},
    free:{img:['Seated_Dumbbell_Curl','Alternate_Hammer_Curl'],yt:'standing dumbbell curl proper form',steps:['Stand tall with dumbbells at your sides and palms forward.','Keep the elbows close to the torso and curl without swinging.','Squeeze briefly at the top and lower fully under control.'],tips:['Only the forearms should move.','Use less weight if the torso starts rocking.']}
  },
  hackSquat:{machine:{reuse:'legPress',guide:'legPress',yt:'45 degree leg press proper form'},free:{img:['Goblet_Squat','Dumbbell_Squat'],yt:'goblet squat proper form',steps:['Hold one dumbbell vertically at chest height.','Sit down between the hips while the knees track over the toes.','Keep the whole foot down and stand by driving through the floor.'],tips:['Stay as upright as your structure comfortably allows.','Choose a depth you can control without the heels lifting.']}},
  rdl:{
    machine:{reuse:'rdl',guide:'smithRdl',img:['Smith_Machine_Stiff-Legged_Deadlift','Romanian_Deadlift'],yt:'smith machine romanian deadlift proper form'},
    free:{reuse:'rdl',guide:null,img:['Stiff-Legged_Dumbbell_Deadlift','Romanian_Deadlift'],yt:'dumbbell romanian deadlift proper form',steps:['Stand with dumbbells in front of the thighs, knees softly bent.','Push the hips back and slide the dumbbells close to the legs.','Stop at a strong hamstring stretch, then drive the hips forward to stand.'],tips:['Keep the dumbbells close to your body.','The knee angle should change very little.']}
  },
  bulgarian:{
    machine:{guide:'singleLegPress',img:['Leg_Press','Single-Leg_High_Box_Squat'],yt:'single leg press proper form',side:true,steps:['Place one foot near the center of the platform and keep the other leg out of the way.','Lower the platform until the working knee reaches a comfortable depth.','Press through the whole foot without locking the knee.'],tips:['Keep the pelvis square on the seat.','Match the range of motion on both legs.']},
    free:{img:['Dumbbell_Lunges','Barbell_Reverse_Lunge'],yt:'dumbbell reverse lunge proper form',side:true,steps:['Stand tall with dumbbells at your sides.','Step one leg backward and lower until the front leg reaches a stable depth.','Drive through the front foot to return, then repeat on the same side or alternate.'],tips:['Keep most of the load on the front leg.','A slightly longer step usually feels more glute-dominant.']}
  },
  seatedLegCurl:{machine:{reuse:'lyingLegCurl',guide:'lyingLegCurl',yt:'lying leg curl proper form'},free:{img:['Floor_Glute-Ham_Raise','Single_Leg_Glute_Bridge'],yt:'hamstring walkout bodyweight proper form',loadMode:'bodyweight',steps:['Lie on your back with knees bent and lift the hips into a bridge.','Take small heel steps away from the body while keeping the hips elevated.','Walk the heels back in under control and repeat.'],tips:['Keep the ribs down and hips from sagging.','Shorter steps make the movement easier.']}},
  standingCalf:{
    machine:{guide:'legPressCalf',img:['Calf_Press_On_The_Leg_Press_Machine','Calf_Press'],yt:'leg press calf raise proper form',steps:['Place only the balls of the feet on the lower edge of the leg-press platform.','Keep the knees nearly straight and let the heels travel down into a stretch.','Press through the toes as high as possible, then lower slowly.'],tips:['Move only at the ankles.','Pause briefly in the stretched position.']},
    free:{img:['Standing_Dumbbell_Calf_Raise','Standing_Calf_Raises'],yt:'single leg calf raise dumbbell proper form',loadMode:'bodyweight',side:true,steps:['Stand on one leg with the ball of the foot on a step or plate edge.','Lower the heel into a deep controlled stretch.','Rise as high as possible onto the toes; hold a dumbbell when bodyweight becomes easy.'],tips:['Use support for balance if needed.','Do not bounce through the bottom.']}
  },
  pullUp:{machine:{reuse:'latPulldown',guide:'latPulldown',yt:'neutral grip lat pulldown proper form'},free:{reuse:'pullUp',guide:null,loadMode:'bodyweight',assist:false,yt:'bodyweight pull up negative pull up proper form'}},
  dbBench:{machine:{reuse:'machineChest',guide:'chestPress',yt:'machine chest press proper form'},free:{img:['Barbell_Bench_Press_-_Medium_Grip','Barbell_Bench_Press'],yt:'barbell bench press proper form',steps:['Lie on a flat bench with eyes under the bar and feet planted.','Retract the shoulder blades, unrack and lower the bar to the mid-to-lower chest.','Press the bar up while keeping the upper back tight.'],tips:['Keep wrists stacked over forearms.','Use safeties or a spotter when lifting heavy.']}},
  seatedRow:{machine:{reuse:'chestRow',guide:'chestRow',yt:'chest supported row machine proper form'},free:{img:['One-Arm_Dumbbell_Row','Dumbbell_Incline_Row'],yt:'one arm dumbbell row proper form',side:true,steps:['Support one hand and knee on a bench and hold a dumbbell in the free hand.','Let the shoulder reach forward slightly, then row the elbow toward the hip.','Pause briefly and lower to a full controlled stretch.'],tips:['Keep the torso square to the floor.','Do not twist to finish the rep.']}},
  machineShoulder:{machine:{reuse:'machineShoulder',guide:'shoulderPress',img:['Leverage_Shoulder_Press','Machine_Shoulder_Military_Press'],yt:'plate loaded shoulder press proper form'},free:{img:['Dumbbell_Shoulder_Press','Seated_Dumbbell_Press'],yt:'seated dumbbell shoulder press proper form',steps:['Sit on a bench with back support and bring dumbbells to shoulder level.','Keep wrists over elbows and press overhead.','Lower until the elbows are around or slightly below shoulder height.'],tips:['Keep the ribs down and back supported.','Do not force an excessively deep bottom position.']}},
  lowHighFly:{
    machine:{guide:'inclineChestPress',img:['Leverage_Incline_Chest_Press','Machine_Bench_Press'],yt:'incline chest press machine proper form',steps:['Set the seat so the handles begin near the upper chest.','Keep shoulder blades against the pad and press upward in the machine path.','Return slowly to a comfortable chest stretch.'],tips:['Think upper chest, not shoulders.','Do not let the shoulders roll forward at the finish.']},
    free:{img:['Incline_Dumbbell_Flyes','Incline_Dumbbell_Flyes_-_With_A_Twist'],yt:'incline dumbbell fly proper form',steps:['Set a bench to a low incline and hold light dumbbells above the chest.','Keep a soft fixed elbow bend and open the arms in a wide arc.','Stop at a controlled chest stretch and bring the dumbbells back together.'],tips:['This is a fly, not a press; keep the elbow angle nearly fixed.','Use lighter weight than your pressing movements.']}
  },
  rearDeltFly:{machine:{reuse:'reversePecDeck',guide:'reversePecDeck',yt:'reverse pec deck rear delt fly proper form'},free:{img:['Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench','Dumbbell_Lying_Rear_Lateral_Raise'],yt:'bent over dumbbell rear delt fly proper form',steps:['Hinge forward and brace the torso.','With soft elbows, sweep the dumbbells out to the sides.','Lower slowly without turning the movement into a row.'],tips:['Use light weight and keep the neck relaxed.','Think about moving the upper arms outward.']}},
  overheadExt:{
    machine:{guide:'tricepsExtensionMachine',img:['Machine_Triceps_Extension','Dip_Machine'],yt:'machine triceps extension proper form',steps:['Adjust the seat and elbow support so the arms feel stable.','Extend the elbows until the arms are nearly straight.','Return slowly to a comfortable stretch without letting the shoulders move.'],tips:['Keep the upper arms fixed.','Use a pain-free elbow range.']},
    free:{img:['Standing_Dumbbell_Triceps_Extension','Standing_One-Arm_Dumbbell_Triceps_Extension'],yt:'one dumbbell overhead triceps extension proper form',steps:['Hold one dumbbell with both hands above the head.','Keep the upper arms near the ears and bend the elbows to lower the dumbbell behind the head.','Extend the elbows to return overhead.'],tips:['Keep the ribs down and avoid flaring the elbows excessively.','Use a load that allows a deep controlled stretch.']}
  },
  preacherCurl:{machine:{reuse:'preacherCurl',guide:'preacher',img:['Machine_Preacher_Curls','Preacher_Curl'],yt:'machine preacher curl proper form'},free:{img:['EZ-Bar_Curl','Barbell_Curl'],yt:'standing ez bar curl proper form',steps:['Stand tall holding an EZ-bar with an underhand grip.','Keep the elbows near the sides and curl without leaning back.','Squeeze the biceps, then lower until the arms are nearly straight.'],tips:['Keep the torso still.','Do not throw the elbows forward to finish the rep.']}},
  hipThrust:{
    machine:{guide:'gluteDrive',img:['Barbell_Hip_Thrust','Barbell_Glute_Bridge'],yt:'glute drive hip thrust machine proper form',steps:['Set your upper back against the machine pad and secure the hip belt or pad.','Place the feet so the shins are close to vertical at lockout.','Drive the hips up, squeeze the glutes, then lower under control.'],tips:['Keep the chin tucked and ribs down.','Finish with the glutes, not a lower-back arch.']},
    free:{img:['Barbell_Glute_Bridge','Barbell_Hip_Thrust'],yt:'dumbbell glute bridge proper form',steps:['Lie on the floor with knees bent and place a dumbbell across the hips.','Brace the core and drive through the heels to lift the hips.','Squeeze the glutes at the top, then lower slowly.'],tips:['Keep the ribs down.','Use padding under the dumbbell if needed.']}
  },
  legPress:{machine:{reuse:'hackSquat',guide:'hackSquat',yt:'hack squat machine proper form'},free:{img:['Goblet_Squat','Dumbbell_Squat'],yt:'goblet squat proper form',steps:['Hold one dumbbell at the chest and stand around shoulder width.','Squat down while keeping the whole foot planted.','Drive up through the floor while the knees track with the toes.'],tips:['Choose a comfortable stance and depth.','Keep the dumbbell close to the chest.']}},
  lyingLegCurl:{machine:{reuse:'seatedLegCurl',guide:'seatedLegCurl',yt:'seated leg curl proper form'},free:{img:['Floor_Glute-Ham_Raise','Single_Leg_Glute_Bridge'],yt:'hamstring walkout bodyweight proper form',loadMode:'bodyweight',steps:['Start in a glute bridge with heels near the hips.','Walk the heels away in small steps while keeping the hips elevated.','Walk them back in under control.'],tips:['Keep tension on the hamstrings throughout.','Make the steps shorter if your hips drop.']}},
  backExt:{
    machine:{guide:'backExtensionMachine',img:['Hyperextensions_Back_Extensions','Hyperextensions_With_No_Hyperextension_Bench'],yt:'back extension machine glute focus proper form',steps:['Set the machine so the pivot and pads fit your torso comfortably.','Brace the trunk and extend until the body reaches a neutral upright position.','Return slowly without collapsing forward.'],tips:['Do not hyperextend past neutral.','Think hips and glutes rather than throwing the chest backward.']},
    free:{reuse:'rdl',guide:null,img:['Romanian_Deadlift','Stiff-Legged_Barbell_Deadlift'],yt:'dumbbell romanian deadlift glute hamstring proper form',steps:['Hold dumbbells in front of the thighs with knees softly bent.','Push the hips back and lower the weights close to the legs.','Stand by driving the hips forward and squeezing the glutes.'],tips:['Keep a neutral spine.','Stop when the hamstrings are strongly stretched.']}
  },
  seatedCalf:{machine:{reuse:'standingCalf',guide:'standingCalf',yt:'standing calf raise machine proper form'},free:{img:['Standing_Dumbbell_Calf_Raise','Standing_Calf_Raises'],yt:'single leg calf raise proper form',loadMode:'bodyweight',side:true,steps:['Stand on one leg with the ball of the foot on an edge.','Lower the heel under control into a full stretch.','Rise as high as possible; add a dumbbell when bodyweight is easy.'],tips:['Pause briefly at the bottom.','Use a support for balance so the calf does the work.']}}
};

function variantKey(v){return VARIANT_KEYS.includes(v)?v:'primary'}
function variantProfile(exId,v='primary'){
  v=variantKey(v);const base=EX[exId],x=EXTRAS[exId]||{};
  if(v==='primary')return Object.assign({},base,{variant:'primary',fa:x.fa||'',equipment:'Programmed setup',guide:x.guide||null,loadMode:base.assist?'assist':'external'});
  const a=x[v]||{},d=(ALT_DETAILS[exId]&&ALT_DETAILS[exId][v])||{},source=d.reuse&&EX[d.reuse]?EX[d.reuse]:base;
  const p=Object.assign({},source,d,{name:a.name||source.name,fa:a.fa||'',equipment:a.equipment||'',cue:a.cue||'',variant:v,type:base.type,group:base.group});
  p.muscles=d.muscles||source.muscles||base.muscles;p.img=d.img||source.img||base.img;p.steps=d.steps||source.steps||base.steps;p.tips=d.tips||source.tips||base.tips;p.yt=d.yt||source.yt||base.yt;
  p.guide=d.guide===null?null:(d.guide||source.guide||null);p.side=d.side!=null?!!d.side:!!source.side;p.assist=d.assist!=null?!!d.assist:false;p.loadMode=d.loadMode||(p.assist?'assist':'external');
  return p;
}
function itemVariant(it){return variantKey(it&&it.variant)}
function selectedProfile(day,i,create=false){const plan=DAY[day].items[i],s=session(day,i,create);return variantProfile(plan.ex,itemVariant(s))}
function variantTabsHTML(exId,selected){
  return `<div class="variant-picker"><div class="variant-cap"><span>Equipment option</span><small>Saved for this workout only</small></div><div class="variant-tabs" role="tablist" aria-label="Exercise equipment option">${VARIANT_KEYS.map(v=>{const p=variantProfile(exId,v),m=VARIANT_META[v],on=v===selected;return `<button type="button" class="variant-tab press${on?' on':''}" role="tab" aria-selected="${on}" data-act="variant" data-v="${v}"><span>${m.short}</span><b>${p.name}</b><em dir="rtl">${p.fa||''}</em></button>`}).join('')}</div><p class="variant-rule">${IC.info}<span>Pick the version you actually perform today. Progress and history are tracked separately for each version.</span></p></div>`;
}
function machineGuideHTML(profile){
  const g=profile&&profile.guide&&MACHINE_GUIDES[profile.guide];if(!g)return '';
  return `<details class="machine-help"><summary class="machine-summary press"><span class="machine-ic">${IC.info}</span><span class="machine-name"><small>Machine guide</small><b>${g.en}</b><em dir="rtl">${g.fa}</em></span><span class="machine-arrow">${IC.chev}</span></summary><div class="machine-panel"><p class="machine-about" dir="rtl">${g.about}</p><p class="h3">Setup</p><ol class="machine-steps" dir="rtl">${g.setup.map(x=>`<li><span>${x}</span></li>`).join('')}</ol><p class="machine-check">${IC.check}<span dir="rtl">${g.check}</span></p></div></details>`;
}

const GROUPS=['Chest','Back','Shoulders','Arms','Quads','Hamstrings','Glutes','Calves'];

/* ---------- Program ---------- */
const DAYS=[
  {key:'sat',day:'Saturday',short:'Sat',dow:6,title:'Upper A',focus:'Back + Upper Chest',items:[
    {ex:'inclineSmith',sets:4,reps:[6,10]},{ex:'chestRow',sets:4,reps:[6,10]},{ex:'latPulldown',sets:3,reps:[8,12]},{ex:'machineChest',sets:3,reps:[8,12]},
    {ex:'cableLateral',sets:3,reps:[12,20]},{ex:'reversePecDeck',sets:3,reps:[12,20]},{ex:'ropePushdown',sets:3,reps:[10,15]},{ex:'inclineCurl',sets:3,reps:[10,15]}]},
  {key:'sun',day:'Sunday',short:'Sun',dow:0,title:'Lower A',focus:'Hamstrings + Quads',items:[
    {ex:'hackSquat',sets:3,reps:[6,10]},{ex:'rdl',sets:3,reps:[6,10]},{ex:'bulgarian',sets:2,reps:[8,12]},{ex:'seatedLegCurl',sets:3,reps:[10,15]},{ex:'standingCalf',sets:2,reps:[10,15]}]},
  {key:'tue',day:'Tuesday',short:'Tue',dow:2,title:'Upper B',focus:'Back Width + Chest + Shoulders',items:[
    {ex:'pullUp',sets:3,reps:[6,10]},{ex:'dbBench',sets:3,reps:[6,10]},{ex:'seatedRow',sets:3,reps:[8,12]},{ex:'machineShoulder',sets:2,reps:[8,12]},{ex:'lowHighFly',sets:3,reps:[10,15]},
    {ex:'cableLateral',sets:3,reps:[12,20],ss:'A'},{ex:'rearDeltFly',sets:2,reps:[12,20],ss:'A'},{ex:'overheadExt',sets:3,reps:[10,15],ss:'B'},{ex:'preacherCurl',sets:3,reps:[10,15],ss:'B'}]},
  {key:'thu',day:'Thursday',short:'Thu',dow:4,title:'Lower B',focus:'Glutes + Hamstrings + Quad Maintenance',items:[
    {ex:'hipThrust',sets:3,reps:[6,10]},{ex:'legPress',sets:3,reps:[10,15]},{ex:'lyingLegCurl',sets:3,reps:[8,12]},{ex:'backExt',sets:2,reps:[10,15]},{ex:'seatedCalf',sets:2,reps:[10,15]}]}
];
const DAY=Object.fromEntries(DAYS.map(d=>[d.key,d]));
const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const IMG='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const ID_RE=new RegExp('^\\d{4}-\\d{2}-\\d{2}_('+DAYS.map(d=>d.key).join('|')+')$');

/* ---------- Helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseISO=s=>new Date(s+'T00:00');
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const satStart=d=>{const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+1)%7));return x};
const fmt=s=>{s=Math.max(0,Math.round(s||0));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
const fmtDate=s=>parseISO(s).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const fmtInt=v=>Math.round(v||0).toLocaleString('en-US');
const fmtK=v=>{v=Math.round(v||0);return v>=10000?Math.round(v/1000)+'k':v>=1000?(v/1000).toFixed(1).replace(/\.0$/,'')+'k':String(v)};
const fmtDur=m=>{m=Math.round(m||0);if(m<60)return m+'m';const h=Math.floor(m/60),r=m%60;return r?`${h}h ${r}m`:`${h}h`};
const tm=ts=>new Date(ts).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
const e1=(w,r)=>w>0&&r>0?w*(1+r/30):0;
const r1=v=>Math.round(v*10)/10;
/* Persian/Arabic digits and decimal comma → plain ASCII number string */
const normNum=v=>String(v??'')
  .replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  .replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d))
  .replace(/[٫,]/g,'.').replace(/[^\d.]/g,'');
const num=v=>parseFloat(normNum(v))||0;
const haptic=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lsWarned=false;
const LS={
  get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){if(!lsWarned){lsWarned=true;setTimeout(()=>toast('Storage is full. Back up, then delete old history.'),0)}return false}}
};
function relDays(d){const n=Math.round((parseISO(iso())-parseISO(d))/864e5);return n<=0?'Today':n===1?'Yesterday':n+' days ago'}
function relTime(ts){const m=Math.round((Date.now()-ts)/60000);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' d ago'}
let toT;
function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toT);toT=setTimeout(()=>t.classList.remove('show'),2600)}
function ask(msg,okLabel='Confirm',danger=false){
  const d=$('#dlg');
  if(!d||!d.showModal)return Promise.resolve(confirm(msg));
  $('#dlgMsg').textContent=msg;const b=$('#dlgOk');b.textContent=okLabel;b.classList.toggle('dz',!!danger);
  d.returnValue='';d.showModal();
  return new Promise(res=>d.addEventListener('close',()=>res(d.returnValue==='ok'),{once:true}));
}

/* ---------- Sanitizers (everything from storage, backups and the server passes through these) ---------- */
const finite=v=>typeof v==='number'&&isFinite(v)?v:null;
function cleanW(x){
  if(!x||typeof x!=='object'||typeof x.id!=='string'||!ID_RE.test(x.id))return null;
  const items=(Array.isArray(x.items)?x.items:[]).filter(it=>it&&typeof it.ex==='string'&&EX[it.ex]).map(it=>({
    ex:it.ex,
    variant:variantKey(it.variant),
    sets:(Array.isArray(it.sets)?it.sets:[]).slice(0,20).map(s=>({w:normNum(s&&s.w).slice(0,7),r:normNum(s&&s.r).slice(0,4),d:!!(s&&s.d),t:finite(s&&s.t)}))
  }));
  const w={id:x.id,v:3,day:x.id.slice(11),date:x.id.slice(0,10),startedAt:finite(x.startedAt),finishedAt:finite(x.finishedAt),items,abs:!!x.abs,bw:finite(x.bw)||75,durOverride:finite(x.durOverride),updatedAt:finite(x.updatedAt)||0};
  if(x.deleted)w.deleted=true;
  return w;
}
function cleanS(s){
  s=s&&typeof s==='object'?s:{};
  const n=(v,lo,hi,d)=>{if(v==null||v==='')return d;v=Number(v);return isFinite(v)?Math.min(hi,Math.max(lo,v)):d};
  return{unit:s.unit==='lb'?'lb':'kg',restC:n(s.restC,60,300,150),restI:n(s.restI,30,180,75),sound:s.sound!==false,wake:!!s.wake,bw:n(s.bw,30,250,75),updatedAt:n(s.updatedAt,0,9e15,0)};
}

/* =====================================================================
   DATA LAYER — all reads and writes go through Store.
   Local-first: changes save to localStorage (debounced), then Sync
   pushes them to the server when CONFIG.server.enabled is true.
   ===================================================================== */
const hasActivity=w=>!!(w.abs||w.items.some(it=>it.sets.some(s=>s.d)));
const Store={
  W:LS.get('gp.workouts',{}),
  S:cleanS(LS.get('gp.settings',{})),
  ver:0,dirty:new Set(),saveT:0,_l:null,_lv:-1,
  /* merge records from another source; newer updatedAt wins (ge: ties win too) */
  merge(obj,ge){
    let ch=false;
    Object.values(obj||{}).forEach(r=>{
      if(!r||typeof r.id!=='string')return;
      const l=this.W[r.id],ru=+r.updatedAt||0,lu=l?(l.updatedAt||0):-1;
      if(ge?ru>=lu:ru>lu){const c=cleanW(r);if(c){this.W[c.id]=c;ch=true}}
    });
    if(ch)this.ver++;
    return ch;
  },
  saveW(){this.merge(LS.get('gp.workouts',{}));LS.set('gp.workouts',this.W)}, // merge first so another tab's edits aren't overwritten
  saveS(){this.S.updatedAt=Date.now();this.ver++;LS.set('gp.settings',this.S);Sync.queue('settings',this.S)},
  get(id){const w=this.W[id];return w&&!w.deleted?w:null},
  list(){
    if(this._lv!==this.ver){
      this._l=Object.values(this.W).filter(w=>!w.deleted&&hasActivity(w)).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:(a.startedAt||0)-(b.startedAt||0));
      this._lv=this.ver;
    }
    return this._l;
  },
  ensure(day,date=activeDate(day)){
    const id=`${date}_${day}`,plan=DAY[day].items;let w=this.W[id];
    if(!w||w.deleted){w=this.W[id]={id,v:3,day,date,startedAt:null,finishedAt:null,items:[],abs:false,bw:this.S.bw,durOverride:null,updatedAt:Date.now()};this.ver++}
    /* align stored items with the plan by exercise, not by position */
    const pool=w.items.slice();
    w.items=plan.map(p=>{const k=pool.findIndex(x=>x.ex===p.ex);return k>=0?pool.splice(k,1)[0]:{ex:p.ex,variant:'primary',sets:[]}}).concat(pool);
    plan.forEach((p,i)=>{const x=w.items[i];x.variant=variantKey(x.variant);while(x.sets.length<p.sets)x.sets.push({w:'',r:'',d:false,t:null})});
    return w;
  },
  touch(w,now){
    w.updatedAt=Date.now();this.ver++;this.dirty.add(w.id);
    clearTimeout(this.saveT);
    if(now)this.flush();else this.saveT=setTimeout(()=>this.flush(),400);
  },
  flush(){
    clearTimeout(this.saveT);
    if(!this.dirty.size)return;
    this.saveW();
    this.dirty.forEach(id=>{const w=this.W[id];if(w)Sync.queue(w.deleted?'delete':'put',w)});
    this.dirty.clear();
  },
  remove(id){const w=this.W[id];if(!w)return;w.deleted=true;this.touch(w,true)}
};
const S=Store.S;
(()=>{const raw=Store.W;Store.W={};for(const k in raw){const c=cleanW(raw[k]);if(c)Store.W[c.id]=c}})();

const Sync={
  q:[],last:LS.get('gp.lastSync',0),busy:false,timer:0,backoff:0,status:'idle',
  get configured(){return !!(CONFIG.server.enabled&&/^https:\/\//.test(CONFIG.server.baseUrl)&&!CONFIG.server.baseUrl.includes('YOUR_PROJECT_REF')&&!!CONFIG.server.publicKey&&!CONFIG.server.publicKey.includes('YOUR_SUPABASE_PUBLISHABLE_KEY'))},
  get on(){return this.configured&&!!this.token()},
  token(){return LS.get('gp.token','')||''},
  load(){
    const q=LS.get('gp.outbox',[]);let fix=false;
    this.q=(Array.isArray(q)?q:[]).filter(x=>x&&x.key).map((x,k)=>{if(!x.id){x.id='o'+Date.now()+k;fix=true}return x});
    if(fix)LS.set('gp.outbox',this.q);
  },
  queue(type,obj){
    if(!this.on)return;
    const key=type==='settings'?'settings':obj.id;
    this.q=LS.get('gp.outbox',[]).filter(x=>x.key!==key);
    this.q.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),key,type,body:JSON.parse(JSON.stringify(obj))});
    LS.set('gp.outbox',this.q);
    this.schedule(1200);
  },
  schedule(ms){clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush(),ms)},
  async req(method,path,body,tokenOverride){
    const t=tokenOverride||this.token();
    const headers={'Content-Type':'application/json','apikey':CONFIG.server.publicKey};
    if(t)headers.Authorization='Bearer '+t;
    const res=await fetch(CONFIG.server.baseUrl.replace(/\/$/,'')+path,{method,headers,body:body?JSON.stringify(body):undefined});
    if(!res.ok){let detail='';try{const d=await res.json();detail=d&&d.error?String(d.error):''}catch(e){}const err=new Error(detail||('HTTP '+res.status));err.status=res.status;throw err}
    return res.status===204?null:res.json().catch(()=>null);
  },
  async connect(code){
    if(!this.configured)throw new Error('Cloud setup is incomplete. Check cloud-config.js.');
    if(!code||!code.trim())throw new Error('Paste your private sync code first.');
    const candidate=code.trim();
    // Validate the code before saving it on this device.
    const data=await this.req('GET','/workouts?since=0',undefined,candidate);
    if(!data||!Array.isArray(data.workouts))throw new Error('The server response was unexpected.');
    if(!LS.set('gp.token',candidate))throw new Error('Could not save the code in this browser.');
    this.status='connected';LS.set('gp.pullSince',0);
    const pulled=await this.pull(true);
    if(!pulled){LS.set('gp.token','');throw new Error('The code was accepted, but cloud data could not be downloaded. Check the internet and try again.');}
    // Merge remote data first, then upload the combined local history. The server
    // rejects older payload versions so a stale device cannot overwrite newer data.
    this.seed();
    await this.flush();
    return true;
  },
  async flush(){
    if(!this.on||this.busy||!navigator.onLine)return;
    this.busy=true;this.status='syncing';
    try{
      for(;;){
        this.q=LS.get('gp.outbox',[]);
        const op=this.q[0];if(!op)break;
        try{
          if(op.type==='put')await this.req('PUT','/workouts/'+encodeURIComponent(op.key),op.body);
          else if(op.type==='delete')await this.req('DELETE','/workouts/'+encodeURIComponent(op.key));
          else await this.req('PUT','/settings',op.body);
        }catch(e){
          // Preserve queued data on every failure; configuration errors must not erase workouts.
          throw e;
        }
        this.q=LS.get('gp.outbox',[]).filter(x=>x.id!==op.id); // remove by id, never by position
        if(!LS.set('gp.outbox',this.q))break;
      }
      this.backoff=0;this.last=Date.now();LS.set('gp.lastSync',this.last);this.status='connected';
    }catch(e){
      this.backoff=Math.min(300000,(this.backoff||2500)*2);
      this.status='error';console.warn('Sync failed; queued data is preserved. Retrying in',this.backoff/1000,'s',e);
      this.schedule(this.backoff);
    }finally{this.busy=false}
  },
  async pull(forceAll=false){
    if(!this.on||!navigator.onLine)return false;
    try{
      const since=forceAll?0:LS.get('gp.pullSince',0);
      const data=await this.req('GET','/workouts?since='+encodeURIComponent(since));
      const list=Array.isArray(data)?data:(data&&data.workouts)||[];
      let changed=Store.merge(list);
      if(data&&data.settings&&(+data.settings.updatedAt||0)>(S.updatedAt||0)){Object.assign(S,cleanS(Object.assign({},S,data.settings)));LS.set('gp.settings',S);Store.ver++;changed=true}
      /* Server cursor overlaps by five minutes to tolerate clock skew. */
      const cursor=data&&(data.cursor!=null?data.cursor:data.serverTime);
      LS.set('gp.pullSince',cursor!=null?cursor:Math.max(0,Date.now()-5*60000));
      this.last=Date.now();LS.set('gp.lastSync',this.last);this.status='connected';
      if(changed){Store.saveW();refreshBase()}
      return true;
    }catch(e){this.status='error';console.warn('Pull failed',e);return false}
  },
  seed(){ // Upload the merged local history after first pulling remote records.
    if(!this.on)return;
    Object.values(Store.W).forEach(w=>{if(hasActivity(w)||w.deleted)this.queue(w.deleted?'delete':'put',w)});
    this.queue('settings',S);
  }
};
Sync.load();

function migrateLegacy(log,abs){
  Object.entries(log||{}).forEach(([exId,arr])=>(Array.isArray(arr)?arr:[]).forEach(e=>{
    if(!e||!DAY[e.day]||typeof e.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date))return;
    const d=DAY[e.day],i=d.items.findIndex(it=>it.ex===exId);if(i<0)return;
    const w=Store.ensure(e.day,e.date);
    (e.sets||[]).forEach((s,j)=>{if(s&&w.items[i].sets[j])Object.assign(w.items[i].sets[j],{w:normNum(s.w),r:normNum(s.r),d:!!s.d})});
  }));
  Object.keys(abs||{}).forEach(k=>{const[date,day]=k.split(':');if(DAY[day]&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&abs[k])Store.ensure(day,date).abs=true});
  Store.ver++;Store.saveW();
}
if(!LS.get('gp.migrated2',false)){const old=LS.get('gp.log',null);if(old)migrateLegacy(old,LS.get('gp.abs',{}));LS.set('gp.migrated2',true)}

/* Purge old tombstones and empty abandoned workouts */
(()=>{
  const cut=Date.now()-CONFIG.tombstoneDays*864e5,old=iso(addDays(new Date(),-2)),pend=new Set(Sync.q.map(x=>x.key));let n=0;
  for(const id in Store.W){
    const w=Store.W[id];if(pend.has(id))continue;
    if((w.deleted&&(w.updatedAt||0)<cut)||(!w.deleted&&!hasActivity(w)&&w.date<old)){delete Store.W[id];n++}
  }
  if(n){Store.ver++;LS.set('gp.workouts',Store.W)}
})();

/* ---------- Domain logic ---------- */
/* An unfinished workout started late keeps its date past midnight */
function activeDate(day){
  const y=iso(addDays(new Date(),-1)),w=Store.get(`${y}_${day}`);
  return w&&w.startedAt&&!w.finishedAt&&Date.now()-w.startedAt<CONFIG.overnightHours*36e5?y:iso();
}
const todayId=day=>`${activeDate(day)}_${day}`;
const todayW=day=>Store.get(todayId(day));
function itemFor(w,plan,i){const x=w.items[i];return x&&x.ex===plan[i].ex?x:(w.items.find(y=>y.ex===plan[i].ex)||null)}
function session(day,i,create){const w=create?Store.ensure(day):todayW(day);return w?itemFor(w,DAY[day].items,i):null}
const repsTxt=it=>`${it.reps[0]}–${it.reps[1]}`;
const isComp=it=>EX[it.ex].type==='compound';
const restFor=it=>isComp(it)?S.restC:S.restI;
const bwU=kg=>S.unit==='kg'?kg:kg*2.20462;
function setTxt(s,ex){
  const r=esc(s.r)||'–',W=num(s.w),mode=ex&&ex.loadMode||'external';
  if(mode==='assist')return `${W?'−'+esc(s.w):'BW'}×${r}`;
  if(mode==='bodyweight')return `${W?'BW+'+esc(s.w):'BW'}×${r}`;
  return (s.w?esc(s.w)+'×':'')+r;
}
function load(ex,w,bw){const W=num(w),mode=ex&&ex.loadMode||'external',B=bwU(bw||S.bw);if(mode==='assist')return Math.max(0,B-W);if(mode==='bodyweight')return B+W;return W}
function topTxt(ex,top){
  if(!top)return '';const mode=ex&&ex.loadMode||'external';
  if(mode==='assist')return top.W?`${r1(top.W)} ${S.unit} assist × ${top.R}`:`Bodyweight × ${top.R}`;
  if(mode==='bodyweight')return `${top.W?'BW + '+r1(top.W)+' '+S.unit:'Bodyweight'} × ${top.R}`;
  return top.W?`${r1(top.W)} ${S.unit} × ${top.R}`:'';
}

function doneCount(key,i){const s=session(key,i);return s?s.sets.slice(0,DAY[key].items[i].sets).filter(x=>x.d).length:0}
function dayProgress(key){let done=0,total=0;DAY[key].items.forEach((it,i)=>{total+=it.sets;done+=doneCount(key,i)});return{done,total}}
function nextIdx(key){const its=DAY[key].items;for(let i=0;i<its.length;i++)if(doneCount(key,i)<its[i].sets)return i;return -1}
function estMin(key){let sec=0;DAY[key].items.forEach(it=>{sec+=it.sets*((EX[it.ex].side?90:45)+restFor(it))});return Math.max(5,Math.round(sec/300)*5)}
function weekRange(){const s=satStart(new Date());return[iso(s),iso(addDays(s,6))]}
function weekDone(key){
  const[ws,we]=weekRange(),plan=DAY[key].items;let done=0;
  Store.list().forEach(w=>{
    if(w.day!==key||w.date<ws||w.date>we)return;
    done=Math.max(done,plan.reduce((a,p,i)=>{const it=itemFor(w,plan,i);return a+(it?it.sets.slice(0,p.sets).filter(s=>s.d).length:0)},0));
  });
  return{done,total:plan.reduce((a,it)=>a+it.sets,0)};
}
function doneKeysByWeek(){const m={};Store.list().forEach(w=>{const k=iso(satStart(parseISO(w.date)));(m[k]=m[k]||new Set()).add(w.day)});return m}
function wStats(w){
  let sets=0,vol=0;const ts=[],groups={};
  w.items.forEach(it=>{const ex=variantProfile(it.ex,itemVariant(it));it.sets.forEach(s=>{if(!s.d)return;sets++;vol+=load(ex,s.w,w.bw)*num(s.r)*(ex&&ex.side?2:1);if(s.t)ts.push(s.t);if(ex)groups[ex.group]=(groups[ex.group]||0)+1})});
  let dur;
  if(w.durOverride!=null)dur=w.durOverride;
  else{
    const start=w.startedAt||(ts.length?Math.min(...ts)-60000:0);
    if(start&&w.finishedAt)dur=(w.finishedAt-start)/60000;
    else if(start&&ts.length)dur=(Math.max(...ts)-start)/60000+2+(w.abs?CONFIG.absMinutes:0);
    else dur=sets*2.6+(w.abs?CONFIG.absMinutes:0);
  }
  dur=Math.round(Math.max(0,Math.min(CONFIG.maxSessionMin,dur)));
  const absMin=w.abs?Math.min(CONFIG.absMinutes,dur):0;
  const kcal=Math.round(((dur-absMin)*CONFIG.met.lifting+absMin*CONFIG.met.abs)*(w.bw||S.bw)/60);
  return{sets,vol:Math.round(vol),dur,kcal,groups};
}
const XH=new Map();let xhv=-1;
function exHistory(exId,excludeId,variant='primary'){
  variant=variantKey(variant);if(xhv!==Store.ver){XH.clear();xhv=Store.ver}
  const key=exId+'|'+variant+'|'+(excludeId||'');if(XH.has(key))return XH.get(key);
  const ex=variantProfile(exId,variant),out=[];
  Store.list().forEach(wk=>{if(wk.id===excludeId)return;wk.items.forEach(it=>{
    if(it.ex!==exId||itemVariant(it)!==variant)return;const ds=it.sets.filter(s=>s.d);if(!ds.length)return;
    let top=null,best=0;
    ds.forEach(s=>{const W=num(s.w),R=num(s.r),L=load(ex,s.w,wk.bw);best=Math.max(best,e1(L,R));if(!top||L>top.L||(L===top.L&&R>top.R))top={W,R,L}});
    out.push({wk,item:it,variant,sets:ds,top,e1:best});
  })});
  XH.set(key,out);return out;
}

/* ---------- Analytics ---------- */
const RANGES=['week','month','year'];
function period(range,off){
  const today=new Date();today.setHours(0,0,0,0);
  let s,e,label;const buckets=[];
  const dayB=d=>({s:iso(d),e:iso(d),cap:d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})});
  if(range==='week'){
    s=addDays(satStart(today),7*off);e=addDays(s,6);
    for(let k=0;k<7;k++){const d=addDays(s,k);buckets.push(Object.assign(dayB(d),{lbl:DN[d.getDay()]}))}
    const same=s.getMonth()===e.getMonth();
    label=`${s.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${e.toLocaleDateString('en-US',same?{day:'numeric'}:{month:'short',day:'numeric'})}, ${e.getFullYear()}`;
  }else if(range==='month'){
    s=new Date(today.getFullYear(),today.getMonth()+off,1);e=new Date(s.getFullYear(),s.getMonth()+1,0);
    for(let d=new Date(s);d<=e;d=addDays(d,1))buckets.push(Object.assign(dayB(d),{lbl:[1,8,15,22,29].includes(d.getDate())?String(d.getDate()):''}));
    label=s.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  }else{
    s=new Date(today.getFullYear()+off,0,1);e=new Date(s.getFullYear(),11,31);
    for(let m=0;m<12;m++){const ms=new Date(s.getFullYear(),m,1),me=new Date(s.getFullYear(),m+1,0);buckets.push({s:iso(ms),e:iso(me),lbl:ms.toLocaleDateString('en-US',{month:'narrow'}),cap:ms.toLocaleDateString('en-US',{month:'long',year:'numeric'})})}
    label=String(s.getFullYear());
  }
  const eyebrow=off===0?`This ${range}`:off===-1?`Last ${range}`:`${-off} ${range}s ago`;
  return{range,off,s,e,si:iso(s),ei:iso(e),buckets,label,eyebrow,today};
}
function plannedIn(p){const out=[],end=p.e<p.today?p.e:p.today;for(let d=new Date(p.s);d<=end;d=addDays(d,1)){const t=DAYS.find(x=>x.dow===d.getDay());if(t)out.push({date:iso(d),key:t.key,d:new Date(d)})}return out}
function missedIn(p,dk){const t=iso(p.today);return plannedIn(p).filter(x=>x.date<t&&!(dk[iso(satStart(x.d))]||new Set()).has(x.key))}
function aggregate(p,cutoff){
  const hi=cutoff&&cutoff<p.ei?cutoff:p.ei;
  const ws=Store.list().filter(w=>w.date>=p.si&&w.date<=hi).map(w=>Object.assign({w},wStats(w)));
  const tot={count:ws.length,dur:0,kcal:0,vol:0,sets:0,groups:{}};
  ws.forEach(x=>{tot.dur+=x.dur;tot.kcal+=x.kcal;tot.vol+=x.vol;tot.sets+=x.sets;for(const g in x.groups)tot.groups[g]=(tot.groups[g]||0)+x.groups[g]});
  const series={};['kcal','dur','vol','sets'].forEach(m=>{series[m]=p.buckets.map(b=>ws.reduce((a,x)=>a+(x.w.date>=b.s&&x.w.date<=b.e?x[m]:0),0))});
  return{ws,tot,series};
}
function fullWeekStreak(dk){
  const keys=DAYS.map(d=>d.key),full=s=>{const set=dk[iso(s)];return !!set&&keys.every(k=>set.has(k))};
  let s=satStart(new Date()),n=0;if(!full(s))s=addDays(s,-7);
  while(full(s)){n++;s=addDays(s,-7)}
  return n;
}
function insights(p,a,pa){
  const out=[],t=a.tot,u=S.unit,isCur=p.off===0,rn=p.range,dk=doneKeysByWeek();
  const add=(tone,ic,b,txt)=>out.push({tone,ic,b,txt});
  if(!t.count){add('info',IC.info,'No workouts logged',isCur?'Tick off a set in any workout and it will show up here.':`Nothing was logged this ${rn}.`);return out}
  const plan=plannedIn(p).length;
  if(plan){const pct=Math.round(Math.min(1,t.count/plan)*100);add(pct>=90?'good':pct>=60?'info':'warn',IC.calendar,`${t.count} of ${plan} planned workouts${isCur?' so far':''}`,pct>=90?'Excellent consistency. This is what drives long-term results.':pct>=60?`${pct}% adherence. Aim to hit every planned session.`:`${pct}% adherence. Consistency matters more than any single workout.`)}
  if(isCur){const st=fullWeekStreak(dk);if(st>=2)add('good',IC.flame,`${st}-week streak`,'Weeks in a row with all four workouts done. Keep it going.')}
  if(pa.tot.count){const av=t.vol/t.count,pv=pa.tot.vol/pa.tot.count;if(pv>0&&av>0){const ch=Math.round((av-pv)/pv*100);add(ch>=0?'good':'warn',ch>=0?IC.up:IC.down,`Volume per workout ${ch>=0?'up':'down'} ${Math.abs(ch)}%`,`${fmtK(av)} ${u} per session vs ${fmtK(pv)} ${u} the previous ${rn}${isCur?' at this point':''}.`)}}
  add('info',IC.clock,`Average session: ${fmtDur(t.dur/t.count)}`,`About ${fmtInt(t.kcal/t.count)} kcal per workout, ${fmtInt(t.kcal)} kcal in total. Estimated from duration and your body weight.`);
  let gain=null,stall=null;
  Object.keys(EX).forEach(id=>VARIANT_KEYS.forEach(variant=>{
    const h=exHistory(id,null,variant);if(!h.length)return;
    const before=h.filter(e=>e.wk.date<p.si),inP=h.filter(e=>e.wk.date>=p.si&&e.wk.date<=p.ei);
    if(before.length&&inP.length){const b=Math.max(...before.map(e=>e.e1)),n=Math.max(...inP.map(e=>e.e1));if(b>0&&n>b){const ch=(n-b)/b;if(!gain||ch>gain.ch)gain={id,variant,ch,b,n}}}
    const l3=h.filter(e=>e.wk.date<=p.ei).slice(-3);
    if(!stall&&l3.length===3&&l3[2].wk.date>=p.si&&l3[0].e1>0&&l3[1].e1<=l3[0].e1&&l3[2].e1<=l3[0].e1)stall={id,variant};
  }));
  if(gain){const gx=variantProfile(gain.id,gain.variant);add('good',IC.trophy,`Biggest gain: ${gx.name}`,`Estimated 1RM up ${Math.round(gain.ch*100)}% (${r1(gain.b)} → ${r1(gain.n)} ${u}) using the ${VARIANT_META[gain.variant].short.toLowerCase()} version.`)}
  if(stall){const sx=variantProfile(stall.id,stall.variant);add('warn',IC.alert,`${sx.name} has stalled`,sx.loadMode==='assist'?'No progress over the last 3 sessions. Add one rep per set, or take a little assistance off.':'No progress over the last 3 sessions. Add one rep per set, or make a small load jump.')}
  const miss=missedIn(p,dk);
  if(miss.length){const c={};miss.forEach(x=>c[x.key]=(c[x.key]||0)+1);const k=Object.keys(c).sort((x,y)=>c[y]-c[x])[0];add('warn',IC.calendar,`Most skipped: ${DAY[k].title}`,`Missed ${c[k]}× this ${rn}. If that day doesn't suit you, move it to another day in the same week.`)}
  return out;
}

/* ---------- Charts (pure SVG, no libraries) ---------- */
function niceMax(v){if(v<=0)return 1;const p=Math.pow(10,Math.floor(Math.log10(v))),n=v/p;return(n<=1?1:n<=2?2:n<=5?5:10)*p}
function barChart(vals,labels,ax,sel,aria){
  const W=340,Hh=170,L=38,B=22,T=10,pw=W-L-6,ph=Hh-B-T,n=vals.length,max=niceMax(Math.max(...vals)),slot=pw/n,bw=Math.max(3,Math.min(28,slot*.62));
  let g='',bars='',lbl='',hits='';
  [0,.5,1].forEach(f=>{const y=(T+ph*(1-f)).toFixed(1);g+=`<line x1="${L}" x2="${W-6}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${(+y+3).toFixed(1)}" text-anchor="end">${ax(max*f)}</text>`});
  vals.forEach((v,k)=>{
    const x=L+slot*k+(slot-bw)/2,h=v>0?Math.max(3,ph*v/max):2,y=T+ph-h;
    bars+=`<rect class="bar${v>0?'':' bar0'}${sel!=null&&sel!==k?' dim':''}" data-k="${k}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(4,bw/2).toFixed(1)}" style="animation-delay:${k*(n>12?12:35)}ms"/>`;
    if(labels[k])lbl+=`<text x="${(L+slot*k+slot/2).toFixed(1)}" y="${Hh-6}" text-anchor="middle">${labels[k]}</text>`;
    hits+=`<rect class="hit" tabindex="0" role="button" aria-label="${esc(aria?aria[k]:'')}" data-k="${k}" x="${(L+slot*k).toFixed(1)}" y="${T}" width="${slot.toFixed(1)}" height="${ph}"/>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${Hh}" role="group" aria-label="Bar chart"><g class="grid" aria-hidden="true">${g}</g><g aria-hidden="true">${bars}</g><g aria-hidden="true">${lbl}</g>${hits}</svg>`;
}
function lineChart(pts,label){
  const W=340,Hh=170,L=38,B=22,T=12,pw=W-L-12,ph=Hh-B-T;
  const ys=pts.flatMap(p=>[p.y,p.y2]).filter(v=>v>0);if(!ys.length)return '';
  let mn=Math.min(...ys),mx=Math.max(...ys);if(mn===mx){mn*=.9;mx*=1.1}
  const pad=(mx-mn)*.12;mn=Math.max(0,mn-pad);mx+=pad;
  const n=pts.length,X=k=>L+(n===1?pw/2:pw*k/(n-1)),Y=v=>T+ph*(1-(v-mn)/(mx-mn));
  const path=key=>pts.map((p,k)=>p[key]>0?[X(k),Y(p[key])]:null).filter(Boolean);
  const p1=path('y'),p2=path('y2'),str=a=>a.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');
  let g='';[0,.5,1].forEach(f=>{const v=mn+(mx-mn)*f,y=Y(v).toFixed(1);g+=`<line x1="${L}" x2="${W-6}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${(+y+3).toFixed(1)}" text-anchor="end">${fmtK(v)}</text>`});
  const area=p1.length>1?`<path class="area" d="M${p1[0][0].toFixed(1)},${T+ph} L${str(p1).replace(/ /g,' L')} L${p1[p1.length-1][0].toFixed(1)},${T+ph} Z"/>`:'';
  const dots=p1.map(q=>`<circle class="dot" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.5"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${esc(label||'Progress chart')}"><g class="grid">${g}</g>${area}${p2.length>1?`<polyline class="ln2" points="${str(p2)}"/>`:''}${p1.length>1?`<polyline class="ln" points="${str(p1)}"/>`:''}${dots}<g><text x="${L}" y="${Hh-5}">${pts[0].lbl}</text><text x="${W-6}" y="${Hh-5}" text-anchor="end">${pts[n-1].lbl}</text></g></svg>`;
}

/* ---------- Images ---------- */
const imgCache=new Map(),probeCache=new Map();
function probe(url){
  if(!probeCache.has(url))probeCache.set(url,new Promise(res=>{const im=new Image();im.onload=()=>res(true);im.onerror=()=>res(false);im.src=url}));
  return probeCache.get(url);
}
function resolveImg(exId,variant='primary'){
  variant=variantKey(variant);const key=exId+':'+variant,profile=variantProfile(exId,variant);
  if(!imgCache.has(key))imgCache.set(key,(async()=>{for(const id of profile.img||[]){const a=IMG+id+'/0.jpg';if(await probe(a))return{a,b:IMG+id+'/1.jpg'}}return null})());
  return imgCache.get(key);
}

function loadThumbs(){
  $$('.thumb',app).forEach(async t=>{
    const r=await resolveImg(t.dataset.ex,t.dataset.var||'primary'),im=$('img',t);
    if(!r){t.classList.add('none');return}
    im.onload=()=>t.classList.add('ok');im.src=r.a;
    if(im.complete&&im.naturalWidth)t.classList.add('ok');
  });
}
let mediaTimer=null,mediaPaused=RM;
function stopMedia(){clearInterval(mediaTimer);mediaTimer=null}
async function setupMedia(exId,variant='primary'){
  const m=$('#media',sbody);if(!m)return;variant=variantKey(variant);const profile=variantProfile(exId,variant);
  const r=await resolveImg(exId,variant);if(!m.isConnected)return;
  const[f0,f1]=$$('.frame',m),tag=$('.media-tag',m),btn=$('.media-btn',m);
  if(!r){m.classList.add('failed');$('.media-ph span',m).textContent='Image unavailable — watch the tutorial below';return}
  f0.alt=profile.name+', start position';f0.src=r.a;f0.classList.add('on');m.classList.add('ready');
  if(!(await probe(r.b))||!m.isConnected)return;
  f1.alt=profile.name+', end position';f1.src=r.b;m.classList.add('anim');
  let on=0;const paint=()=>{btn.innerHTML=mediaPaused?IC.play:IC.pause;btn.setAttribute('aria-label',mediaPaused?'Play animation':'Pause animation')};
  paint();btn.onclick=e=>{e.stopPropagation();mediaPaused=!mediaPaused;paint()};stopMedia();
  mediaTimer=setInterval(()=>{if(mediaPaused)return;on^=1;f0.classList.toggle('on',!on);f1.classList.toggle('on',!!on);tag.textContent=on?'Finish':'Start'},1400);
}

/* ---------- Program views ---------- */
function ring(p){
  if(p>=1)return `<span class="done-badge">${IC.check}</span>`;
  const C=2*Math.PI*15;
  return `<svg class="ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="ring-bg"/><circle cx="18" cy="18" r="15" class="ring-fg" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C*(1-p)).toFixed(2)}"/></svg>`;
}
function homeView(){
  const now=new Date(),dow=now.getDay(),today=DAYS.find(d=>d.dow===dow);
  let next=null,inD=0;
  for(let k=1;k<=7;k++){const d=DAYS.find(x=>x.dow===(dow+k)%7);if(d){next=d;inD=k;break}}
  const date=now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  const nextTxt=`Next up: <b>${next.title}</b> ${inD===1?'tomorrow':'on '+next.day}.`;
  /* a make-up or past-midnight workout that's still running */
  const live=DAYS.find(d=>{if(today&&d.key===today.key)return false;const w=todayW(d.key);return !!(w&&!w.finishedAt&&(w.startedAt||hasActivity(w)))});
  let hero;
  if(live){
    const p=dayProgress(live.key);
    hero=`<div class="hero"><p class="eyebrow">${date} · In progress</p><h1>${live.title}</h1><p class="sub">${live.focus} · ${p.done}/${p.total} sets done</p><a class="btn-primary press" href="#/${live.key}"><span class="cta-t">Continue workout</span>${IC.chev}</a></div>`;
  }else if(today){
    const p=dayProgress(today.key),w=todayW(today.key);
    if(w&&w.finishedAt){const st=wStats(w);hero=`<div class="hero"><p class="eyebrow">${date}</p><h1>Workout complete</h1><p class="sub">${today.title} · ${fmtDur(st.dur)} · ${fmtInt(st.kcal)} kcal. ${nextTxt}</p><a class="btn-secondary press" href="#/${today.key}">Review ${today.title}${IC.chev}</a></div>`}
    else hero=`<div class="hero"><p class="eyebrow">${date}</p><h1>${today.title}</h1><p class="sub">${today.focus} · ${today.items.length} exercises · ~${estMin(today.key)} min</p><a class="btn-primary press" href="#/${today.key}"><span class="cta-t">${p.done?`Continue · ${p.done}/${p.total} sets`:'Open workout'}</span>${IC.chev}</a></div>`;
  }else hero=`<div class="hero"><p class="eyebrow">${date}</p><h1>Rest day</h1><p class="sub">Recover well. ${nextTxt}</p><a class="btn-secondary press" href="#/${next.key}">Preview ${next.title}${IC.chev}</a></div>`;
  const week=[6,0,1,2,3,4,5].map(d=>{
    const t=DAYS.find(x=>x.dow===d),w=t?weekDone(t.key):null,full=w&&w.done>=w.total;
    const cls=['wk',t?'train press':'',d===dow?'today':'',full?'full':''].join(' ');
    const inner=`<span class="wk-l">${DN[d]}</span><span class="wk-d">${full?IC.check:t?t.title.replace('Upper','Up').replace('Lower','Lo'):'Rest'}</span>`;
    return t?`<a class="${cls}" href="#/${t.key}" aria-label="${t.day}, ${t.title}${full?', done':''}">${inner}</a>`:`<div class="${cls}">${inner}</div>`;
  }).join('');
  const wt=aggregate(period('week',0)).tot;
  const cards=DAYS.map((d,k)=>{
    const w=weekDone(d.key),isT=d.dow===dow,full=w.done>=w.total;
    const pill=isT?'<span class="pill">Today</span>':full?'<span class="pill dim">Done</span>':(!today&&next.key===d.key)?'<span class="pill">Next</span>':'';
    return `<a class="day-card press${isT?' is-today':''}" href="#/${d.key}" style="--i:${k+4}">
      <span class="day-badge">${d.short}</span>
      <span class="dc-main"><span class="dc-top"><span class="dc-title">${d.title}</span>${pill}</span>
      <span class="dc-focus">${d.focus}</span><span class="dc-meta">${d.items.length} exercises · ${w.total} sets · ~${estMin(d.key)} min</span></span>
      ${w.done?ring(w.done/w.total):IC.chev}</a>`;
  }).join('');
  return `<section class="view"><div class="stagger">${hero}
    <p class="label mt" style="--i:1">This week</p><div class="week" style="--i:1">${week}</div>
    <a class="wk-sum press" href="#/history" style="--i:2"><div><b>${wt.count}<small>/4</small></b><span>Workouts</span></div><div><b>${fmtDur(wt.dur)}</b><span>Time</span></div><div><b>${fmtInt(wt.kcal)}</b><span>kcal</span></div>${IC.chev}</a>
    <p class="label" style="--i:3">Workouts</p>${cards}
    <a class="rules-link press" href="#/rules" style="--i:8">${IC.info}<span><b>Execution rules</b><small>Effort, rest and progression</small></span>${IC.chev}</a></div></section>`;
}
function dotsHTML(key,i){const it=DAY[key].items[i],s=session(key,i);let h='';for(let j=0;j<it.sets;j++)h+=`<i class="${s&&s.sets[j]&&s.sets[j].d?'on':''}"></i>`;return h}
function rowHTML(key,i,nx,started){
  const it=DAY[key].items[i],sess=session(key,i),variant=itemVariant(sess),ex=variantProfile(it.ex,variant),complete=doneCount(key,i)>=it.sets;
  const alt=variant!=='primary'?`<span class="variant-mini ${variant}">${VARIANT_META[variant].short}</span>`:'';
  return `<a class="ex-row press${complete?' complete':''}${started&&i===nx?' next':''}" href="#/${key}/${i}" data-i="${i}" style="--i:${i}">
    <span class="thumb" data-ex="${it.ex}" data-var="${variant}"><img alt="" decoding="async"><em>${i+1}</em></span>
    <span class="ex-main"><span class="up">Up next</span><span class="ex-name-line"><span class="ex-name">${ex.name}</span>${alt}</span>
    <span class="ex-meta"><b>${it.sets} × ${repsTxt(it)}</b>${ex.side?' each leg':''} · ${isComp(it)?'Compound':'Isolation'}</span>
    <span class="dots">${dotsHTML(key,i)}</span></span>${IC.chev}</a>`;
}
function headHTML(key){
  const d=DAY[key],p=dayProgress(key),its=d.items,isT=d.dow===new Date().getDay(),nx=nextIdx(key),wk=weekDone(key),w=todayW(key);
  const started=!!(w&&(w.startedAt||p.done||w.abs)),finished=!!(w&&w.finishedAt);
  const eyebrow=d.day+(isT?' · Today':'')+(!started&&wk.done>=wk.total?' · Done this week':'');
  let cta;
  if(finished){const st=wStats(w);cta=`<div class="done-card"><span class="done-badge">${IC.check}</span><span><b>Workout complete</b><small>${fmtDur(st.dur)} · ${fmtInt(st.kcal)} kcal · ${fmtK(st.vol)} ${S.unit} · ${st.sets} sets</small></span></div><a class="btn-secondary press mt-s" href="#/${key}/w/${esc(w.id)}">View summary${IC.chev}</a>`}
  else if(started){
    const el=w.startedAt?(Date.now()-w.startedAt)/60000:0;
    cta=`<p class="live"><i></i><span id="elapsed">In progress · ${fmtDur(el)}</span></p>`+(nx===-1
      ?`<button class="btn-primary press" data-act="finish"><span class="cta-t">Finish workout</span>${IC.flag}</button>`
      :`<a class="btn-primary press" href="#/${key}/${nx}"><span class="cta-t">Continue: ${selectedProfile(key,nx).name}</span>${IC.chev}</a><button class="ghost press mt-s wide" data-act="finish">${IC.flag} Finish workout</button>`);
  }else cta=`<a class="btn-primary press" href="#/${key}/${Math.max(0,nx)}" data-act="start"><span class="cta-t">Start workout</span>${IC.play}</a>`;
  return `<p class="eyebrow">${eyebrow}</p><h1>${d.title}</h1><p class="sub">${d.focus}</p>
    <div class="stats"><div><b>${its.length}</b><span>Exercises</span></div><div><b>${p.total}</b><span>Sets</span></div><div><b>~${estMin(key)}</b><span>Minutes</span></div></div>
    <div class="prog"><div class="prog-bar"><i style="width:${p.total?p.done/p.total*100:0}%"></i></div><span class="prog-txt">${p.done} / ${p.total} sets</span></div>${cta}`;
}
function dayView(key){
  const its=DAY[key].items,nx=nextIdx(key),started=dayProgress(key).done>0;
  let list='',k=0;
  while(k<its.length){
    if(its[k].ss){const g=its[k].ss,start=k;let inner='';while(k<its.length&&its[k].ss===g){inner+=rowHTML(key,k,nx,started);k++}
      list+=`<div class="ss" style="--i:${start}"><div class="ss-label">${IC.link} Optional superset ${g}</div>${inner}</div>`}
    else{list+=rowHTML(key,k,nx,started);k++}
  }
  const w=todayW(key),absOn=!!(w&&w.abs);
  return `<section class="view">
    <div class="day-head">${headHTML(key)}</div>
    <div class="ex-list stagger">${list}</div>
    <div class="abs${absOn?' done':''}"><span class="abs-ic">${IC.abs}</span><span class="abs-main"><b>Abs · Six Pack in 30 Days</b><small>About 20 min · your current modified version</small></span>
      <button class="chk" data-act="abs" aria-pressed="${absOn}" aria-label="Mark abs done">${IC.check}</button></div>
    <div class="day-foot"><a class="ghost press" href="#/${key}/rules">${IC.info} Rules</a><button class="ghost press" data-act="reset">${IC.refresh} Reset today</button></div>
  </section>`;
}
function updateDay(key){
  if(cur.base!==key)return;
  const head=$('.day-head',app);if(!head)return;
  head.innerHTML=headHTML(key);
  const nx=nextIdx(key),started=dayProgress(key).done>0;
  $$('.ex-row',app).forEach(row=>{
    const i=+row.dataset.i;
    $('.dots',row).innerHTML=dotsHTML(key,i);
    row.classList.toggle('complete',doneCount(key,i)>=DAY[key].items[i].sets);
    row.classList.toggle('next',started&&i===nx);
  });
  const w=todayW(key),abs=$('.abs',app);
  if(abs){abs.classList.toggle('done',!!(w&&w.abs));$('.chk',abs).setAttribute('aria-pressed',!!(w&&w.abs))}
}

/* ---------- History views ---------- */
const HV={range:'week',off:0,metric:'kcal',sel:null,p:null,a:null};
const METRIC={
  kcal:{l:'Calories',f:v=>fmtInt(v)+' kcal',ax:fmtK},
  dur:{l:'Duration',f:fmtDur,ax:fmtDur},
  vol:{l:'Volume',f:v=>fmtK(v)+' '+S.unit,ax:fmtK},
  sets:{l:'Sets',f:v=>fmtInt(v)+' sets',ax:fmtInt}
};
function pnavInner(){const p=period(HV.range,HV.off);return `<button class="icon-btn" data-act="poff" data-d="-1" aria-label="Previous ${HV.range}">${IC.back}</button><div class="pnav-t" aria-live="polite"><span class="eyebrow">${p.eyebrow}</span><b>${p.label}</b></div><button class="icon-btn" data-act="poff" data-d="1" aria-label="Next ${HV.range}" ${HV.off>=0?'disabled':''}>${IC.chev}</button>`}
function historyView(){
  return `<section class="view hv"><div class="day-head hv-head"><p class="eyebrow">Your training</p><h1>History</h1></div>
    <div class="seg" id="rangeSeg" style="--n:3;--v:${RANGES.indexOf(HV.range)}" role="tablist"><i class="pill"></i>${RANGES.map(r=>`<button data-act="range" data-v="${r}" class="${HV.range===r?'on':''}" role="tab" aria-controls="hvBody" aria-selected="${HV.range===r}">${r[0].toUpperCase()+r.slice(1)}</button>`).join('')}</div>
    <div class="pnav" id="pnav">${pnavInner()}</div>
    <div class="stagger" id="hvBody" role="tabpanel">${historyBody()}</div></section>`;
}
function historyBody(){
  const p=period(HV.range,HV.off),pp=period(HV.range,HV.off-1);
  const cut=HV.off===0?iso(addDays(pp.s,Math.round((p.today-p.s)/864e5))):null;
  const a=aggregate(p),pa=aggregate(pp,cut);HV.p=p;HV.a=a;
  const t=a.tot,plan=plannedIn(p).length;
  const kpi=(l,v,sub,c,pv)=>{let d='';if(pv>0){const ch=Math.round((c-pv)/pv*100);d=`<em class="${ch>=0?'up':'down'}">${ch>=0?'▲':'▼'} ${Math.abs(ch)}%</em>`}return `<div class="kpi"><span>${l}</span><b>${v}${sub?`<small>${sub}</small>`:''}</b>${d}</div>`};
  return `
    <div class="kpis" style="--i:0">${kpi('Workouts',t.count,plan?`of ${plan}`:'',t.count,pa.tot.count)}${kpi('Time',fmtDur(t.dur),'',t.dur,pa.tot.dur)}${kpi('Calories',fmtInt(t.kcal),'kcal',t.kcal,pa.tot.kcal)}${kpi('Volume',fmtK(t.vol),S.unit,t.vol,pa.tot.vol)}</div>
    <p class="kpi-note" style="--i:1">${HV.off===0?`Changes compared with the same point last ${p.range}. Calories are estimates.`:`Changes compared with the previous ${p.range}. Calories are estimates.`}</p>
    <div class="card" style="--i:2" id="chartBox">${chartBox()}</div>
    <div class="card" style="--i:3"><div class="card-h"><b>${p.range==='year'?'Months':'Training days'}</b></div>${calHTML(p)}</div>
    <div class="card" style="--i:4"><div class="card-h"><b>Analysis</b></div>${insights(p,a,pa).map(x=>`<div class="ins ${x.tone}"><span class="ins-ic">${x.ic}</span><div><b>${x.b}</b><p>${x.txt}</p></div></div>`).join('')}</div>
    ${t.sets?`<div class="card" style="--i:5"><div class="card-h"><b>Sets by muscle group</b><span class="card-s">${t.sets} sets</span></div>${musclesHTML(t.groups)}</div>`:''}
    ${a.ws.length?`<p class="label mt" style="--i:6">Workouts</p><div class="list" style="--i:6">${a.ws.slice().reverse().map(wRow).join('')}</div>`:''}
    ${exListHTML()}`;
}
function chartBox(){
  const m=METRIC[HV.metric],vals=HV.a.series[HV.metric];
  return `<div class="card-h"><b>Trend</b></div><div class="mchips">${Object.keys(METRIC).map(k=>`<button class="mchip press${HV.metric===k?' on':''}" data-act="metric" data-v="${k}" aria-pressed="${HV.metric===k}">${METRIC[k].l}</button>`).join('')}</div>
    <p class="chart-cap" id="chartCap" aria-live="polite">${capHTML()}</p>${barChart(vals,HV.p.buckets.map(b=>b.lbl),m.ax,HV.sel,HV.p.buckets.map((b,k)=>`${b.cap}: ${m.f(vals[k])}`))}`;
}
function capHTML(){
  const m=METRIC[HV.metric],vals=HV.a.series[HV.metric];
  if(HV.sel!=null)return `${HV.p.buckets[HV.sel].cap}: <b>${m.f(vals[HV.sel])}</b>`;
  const tot=vals.reduce((x,y)=>x+y,0);
  return HV.a.tot.count?`Total <b>${m.f(tot)}</b> · avg <b>${m.f(tot/HV.a.tot.count)}</b> per workout`:'No data for this period yet';
}
function calHTML(p){
  if(p.range==='year')return yearTiles(p);
  const byDate={};Store.list().forEach(w=>{(byDate[w.date]=byDate[w.date]||[]).push(w)});
  const dk=doneKeysByWeek(),t=iso(p.today);
  let h=[6,0,1,2,3,4,5].map(d=>`<span class="cal-h">${DN[d].slice(0,2)}</span>`).join('');
  const pad=(p.s.getDay()+1)%7;for(let k=0;k<pad;k++)h+='<span></span>';
  for(let d=new Date(p.s);d<=p.e;d=addDays(d,1)){
    const di=iso(d),ws=byDate[di],plan=DAYS.find(x=>x.dow===d.getDay());let cls='cal-d';
    if(!ws&&plan){const set=dk[iso(satStart(d))];if(!(set&&set.has(plan.key)))cls+=di<t?' miss':' plan'}
    if(di===t)cls+=' today';
    h+=ws?`<a class="${cls} done press" href="#/history/w/${esc(ws[ws.length-1].id)}" aria-label="${fmtDate(di)}, ${DAY[ws[0].day]?DAY[ws[0].day].title:'workout'}">${d.getDate()}</a>`:`<span class="${cls}">${d.getDate()}</span>`;
  }
  return `<div class="cal">${h}</div><div class="legend"><span><i class="lg"></i>Trained</span><span><i class="lg miss"></i>Missed</span><span><i class="lg plan"></i>Planned</span></div>`;
}
function yearTiles(p){
  const now=new Date(),t=iso(p.today),all=Store.list();
  return `<div class="yr">${p.buckets.map((b,m)=>{
    const n=all.filter(w=>w.date>=b.s&&w.date<=b.e).length,fut=b.s>t;
    const pl=fut?0:plannedIn({s:parseISO(b.s),e:parseISO(b.e),today:p.today}).length,pct=pl?Math.min(1,n/pl):0;
    const off=(parseISO(b.s).getFullYear()-now.getFullYear())*12+m-now.getMonth();
    return `<button class="yr-m press" data-act="tomonth" data-off="${off}" ${fut?'disabled':''} aria-label="${b.cap}: ${n} workouts"><span>${parseISO(b.s).toLocaleDateString('en-US',{month:'short'})}</span><b>${n}</b><i><u style="width:${Math.round(pct*100)}%"></u></i></button>`;
  }).join('')}</div><p class="legend-t">Workouts per month. The bar shows how closely you followed the plan.</p>`;
}
function musclesHTML(g){const mx=Math.max(1,...GROUPS.map(k=>g[k]||0));return GROUPS.map((k,i)=>`<div class="mb"><span>${k}</span><div class="mb-bar"><i style="width:${Math.round((g[k]||0)/mx*100)}%;animation-delay:${i*40}ms"></i></div><b>${g[k]||0}</b></div>`).join('')}
function wRow(x){
  const w=x.w,d=parseISO(w.date),t=DAY[w.day];
  return `<a class="w-row press" href="#/history/w/${esc(w.id)}"><span class="w-date"><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-US',{month:'short'})}</small></span><span class="ex-main"><span class="ex-name">${t?t.title:'Workout'}<span class="w-dn">${DN[d.getDay()]}</span></span><span class="ex-meta">${fmtDur(x.dur)} · ${fmtInt(x.kcal)} kcal · ${fmtK(x.vol)} ${S.unit} · ${x.sets} sets</span></span>${IC.chev}</a>`;
}
function exListHTML(){
  const seen=new Set(),rows=[];
  DAYS.forEach(d=>d.items.forEach(it=>{
    if(seen.has(it.ex))return;seen.add(it.ex);
    const ex=EX[it.ex],h=exHistory(it.ex);if(!h.length)return;
    const l=h[h.length-1],pv=h[h.length-2],tr=!pv?'':l.e1>pv.e1?'up':l.e1<pv.e1?'down':'flat';
    const last=topTxt(ex,l.top)||setTxt(l.sets[0],ex);
    rows.push(`<a class="x-row press" href="#/history/x/${it.ex}"><span class="ex-main"><span class="ex-name">${ex.name}</span><span class="ex-meta">Last: ${last} · ${fmtDate(l.wk.date)}</span></span>${tr?`<span class="tr ${tr}" aria-label="Trend ${tr}">${tr==='up'?IC.up:tr==='down'?IC.down:IC.minus}</span>`:''}${IC.chev}</a>`);
  }));
  return rows.length?`<p class="label mt" style="--i:7">Exercise progress</p><div class="list" style="--i:7">${rows.join('')}</div>`:'';
}
function updateHistory(){
  const seg=$('#rangeSeg',app);if(!seg)return;
  seg.style.setProperty('--v',RANGES.indexOf(HV.range));
  $$('button',seg).forEach(b=>{const on=b.dataset.v===HV.range;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  $('#pnav',app).innerHTML=pnavInner();
  $('#hvBody',app).innerHTML=historyBody();
}

/* ---------- Sheets ---------- */
function histRows(list,ex){return list.map(e=>`<div class="xh"><div class="xh-top"><span>${fmtDate(e.wk.date)} · ${relDays(e.wk.date)}</span>${e.pr?'<span class="pr">PR</span>':''}<em>${e.e1?'e1RM '+r1(e.e1):''}</em></div><div class="set-chips">${e.sets.map(s=>`<span>${setTxt(s,ex)}</span>`).join('')}</div></div>`).join('')}
function exSheet(day,i,tab){
  const d=DAY[day],it=d.items[i],sess=session(day,i),variant=itemVariant(sess),ex=variantProfile(it.ex,variant),comp=isComp(it);
  const s=session(day,i),hist=exHistory(it.ex,todayId(day),variant),prev=hist[hist.length-1]||null;
  const n=doneCount(day,i),allDone=n>=it.sets,meta=VARIANT_META[variant];
  const yt='https://www.youtube.com/results?search_query='+encodeURIComponent(ex.yt);
  const topHit=prev&&prev.sets.length>=it.sets&&prev.sets.slice(0,it.sets).every(x=>num(x.r)>=it.reps[1]);
  let rows='',carry='';
  for(let j=0;j<it.sets;j++){
    const c=s&&s.sets[j]||{w:'',r:'',d:false},p=prev&&prev.sets[j]||{},pw=carry||p.w||'';
    const mode=ex.loadMode||'external',weightLabel=mode==='assist'?'assistance':mode==='bodyweight'?'added weight':'weight';
    rows+=`<div class="set-row${c.d?' done':''}"><span class="set-n">${j+1}</span>
      <label class="fld"><input type="text" inputmode="decimal" autocomplete="off" enterkeyhint="next" data-f="w" data-s="${j}" value="${esc(c.w)}" placeholder="${esc(pw||'–')}" data-p="${esc(pw)}" data-p0="${esc(p.w||'')}" aria-label="Set ${j+1} ${weightLabel}"><em>${S.unit}</em></label>
      <label class="fld"><input type="text" inputmode="numeric" autocomplete="off" enterkeyhint="done" data-f="r" data-s="${j}" value="${esc(c.r)}" placeholder="${esc(p.r||repsTxt(it))}" data-p="${esc(p.r||'')}" aria-label="Set ${j+1} reps"><em>reps</em></label>
      <button class="chk" data-act="check" data-s="${j}" aria-pressed="${c.d}" aria-label="Mark set ${j+1} done">${IC.check}</button></div>`;
    if(c.w)carry=c.w;
  }
  const histHTML=hist.length?`<p class="h3 mt">Previous ${meta.short.toLowerCase()} sessions</p><div class="xh-list">${histRows(hist.slice(-3).reverse(),ex)}</div><a class="ghost press rest-btn" href="#/${day}/x/${it.ex}/${variant}">${IC.chart} Full history for this version</a>`:'';
  const pv=i>0?`<button class="nav-btn press" data-act="nav" data-to="${i-1}">${IC.back}<span><small>Previous</small>${selectedProfile(day,i-1).name}</span></button>`:'<span></span>';
  const nx=i<d.items.length-1?`<button class="nav-btn nx press${allDone?' go':''}" data-act="nav" data-to="${i+1}"><span><small>Next</small>${selectedProfile(day,i+1).name}</span>${IC.chev}</button>`
    :`<button class="nav-btn nx press${allDone?' go':''}" data-act="close"><span><small>Last exercise</small>Back to workout</span>${IC.check}</button>`;
  const variantNote=variant==='primary'?'Programmed movement':`${meta.label} · programmed slot: ${EX[it.ex].name}`;
  return `<div class="sx${tab===1?' log':''}">
    <div class="media-wrap"><div class="media-in"><div class="media" id="media"><div class="media-ph">${IC.dumbbell}<span>Loading demo</span></div><img class="frame" alt=""><img class="frame" alt=""><span class="media-tag">Start</span><button class="media-btn" aria-label="Pause animation"></button></div></div></div>
    <div class="sx-head">
      <p class="eyebrow">Exercise ${i+1} of ${d.items.length} · ${comp?'Compound':'Isolation'}${it.ss?' · Superset '+it.ss:''}</p>
      <div class="variant-context"><span class="variant-state ${variant}">${meta.short}</span><span>${variantNote}</span></div>
      <h2 class="sx-title">${ex.name}</h2>${ex.fa?`<p class="sx-fa" dir="rtl">${ex.fa}</p>`:''}
      <div class="chips">${ex.muscles.map(m=>`<span class="chip">${m}</span>`).join('')}</div>
      ${variantTabsHTML(it.ex,variant)}
      <div class="specs">
        <div class="spec"><span>Sets</span><b>${it.sets}</b></div>
        <div class="spec"><span>Reps</span><b>${repsTxt(it)}${ex.side?'/leg':''}</b></div>
        <div class="spec"><span>Rest</span><b>${fmt(restFor(it))}</b></div>
        <div class="spec"><span>${comp?'Effort':'Last set'}</span><b>${comp?'1–2 RIR':'0–1 RIR'}</b></div>
      </div>
      <div class="seg" style="--v:${tab}" role="tablist"><i class="pill"></i>
        <button role="tab" id="tab0" aria-controls="pan0" data-act="tab" data-v="0" class="${tab===0?'on':''}" aria-selected="${tab===0}">Technique</button>
        <button role="tab" id="tab1" aria-controls="pan1" data-act="tab" data-v="1" class="${tab===1?'on':''}" aria-selected="${tab===1}">Log sets <span class="cnt" id="logCnt">${n}/${it.sets}</span></button>
      </div>
    </div>
    <div class="sx-body">
      <div class="panel" id="pan0" role="tabpanel" aria-labelledby="tab0" ${tab===0?'':'hidden'}>
        <a class="yt press" href="${yt}" target="_blank" rel="noopener"><span class="yt-ic">${IC.yt}</span>Watch ${ex.name} tutorial<span class="ext">${IC.ext}</span></a>
        ${ex.cue?`<div class="variant-cue">${IC.info}<span>${ex.cue}</span></div>`:''}
        ${machineGuideHTML(ex)}
        <p class="h3 technique-h3">How to do it</p><ol class="steps">${ex.steps.map(x=>`<li><span>${x}</span></li>`).join('')}</ol>
        <p class="h3">Form tips</p><ul class="tips">${ex.tips.map(x=>`<li>${IC.check}<span>${x}</span></li>`).join('')}</ul>
        <p class="note">${IC.info}<span>${comp?'Stop with 1–2 reps in reserve. Don\'t regularly take heavy compound lifts to complete failure.':'Earlier sets stop short of failure; only the last set can reach 0–1 reps in reserve.'}${it.ss?' Optional superset: alternate with the paired exercise to save time.':''}</span></p>
      </div>
      <div class="panel" id="pan1" role="tabpanel" aria-labelledby="tab1" ${tab===1?'':'hidden'}>
        ${topHit?`<div class="hint">${IC.trend}<span>${ex.loadMode==='assist'?'You hit the top of the rep range on every set last time. Take a little assistance off today.':'You hit the top of the rep range on every set last time. Increase the load slightly today.'}</span></div>`:''}
        ${ex.loadMode==='assist'?`<p class="first-log">Enter the <b>assistance</b> weight. Leave it empty for bodyweight. Less assistance counts as progress.</p>`:ex.loadMode==='bodyweight'?`<p class="first-log">Leave weight empty for bodyweight. If you add external load, enter only the added weight.</p>`:''}
        ${prev?'':`<p class="first-log">First time logging this version. Its numbers will be tracked separately from the other equipment options.</p>`}
        <div class="set-head"><span>#</span><span>${ex.loadMode==='assist'?'Assist':ex.loadMode==='bodyweight'?'Added wt':'Weight'}</span><span>Reps</span><span></span></div>
        ${rows}
        <button class="ghost press rest-btn" data-act="rest">${IC.clock} Start ${fmt(restFor(it))} rest timer</button>
        ${histHTML}
      </div>
    </div>
    <div class="sx-nav">${pv}${nx}</div>
  </div>`;
}
function xSheet(exId,variant='primary'){
  variant=variantKey(variant);const ex=variantProfile(exId,variant),u=S.unit,h=exHistory(exId,null,variant).map(e=>Object.assign({},e));
  const tabs=`<div class="history-variant-tabs">${VARIANT_KEYS.map(v=>{const p=variantProfile(exId,v),on=v===variant;return `<a class="history-variant press${on?' on':''}" href="#/${cur.base}/x/${exId}/${v}"><span>${VARIANT_META[v].short}</span><b>${p.name}</b></a>`}).join('')}</div>`;
  const head=`<p class="eyebrow">Exercise history · ${VARIANT_META[variant].label}</p><h2 class="sx-title">${ex.name}</h2>${ex.fa?`<p class="sx-fa" dir="rtl">${ex.fa}</p>`:''}<div class="chips">${ex.muscles.map(m=>`<span class="chip">${m}</span>`).join('')}</div>${tabs}`;
  if(!h.length)return `<div class="sx"><div class="sx-pad">${head}<p class="first-log history-empty">No sets logged for this version yet. Choose another tab to see its separate history.</p></div></div>`;
  let best=0,heavy=null,run=0;
  h.forEach(e=>{best=Math.max(best,e.e1);if(e.top&&(!heavy||e.top.L>heavy.L))heavy=e.top;e.pr=run>0&&e.e1>run;run=Math.max(run,e.e1)});
  const last=h[h.length-1],topLbl=ex.loadMode==='assist'?'Effective load':'Top set';
  const pts=h.slice(-24).map(e=>({lbl:fmtDate(e.wk.date),y:e.top?r1(e.top.L):0,y2:r1(e.e1)}));
  const chart=pts.length>1?lineChart(pts,`${ex.name}: ${topLbl.toLowerCase()} and estimated 1RM over time`):'';
  return `<div class="sx"><div class="sx-pad">${head}
    <div class="kpis mt-s">
      <div class="kpi"><span>Best est. 1RM</span><b>${best?r1(best):'–'}${best?`<small>${u}</small>`:''}</b></div>
      <div class="kpi"><span>${topLbl}</span><b class="sm">${heavy?topTxt(ex,heavy):'–'}</b></div>
      <div class="kpi"><span>Sessions</span><b>${h.length}</b></div>
      <div class="kpi"><span>Last trained</span><b class="sm">${relDays(last.wk.date)}</b></div>
    </div>
    ${ex.loadMode==='assist'?'<p class="first-log mt-s">Effective load = body weight minus assistance.</p>':''}
    ${chart?`<div class="card flat"><div class="card-h"><b>Progress</b><span class="card-s"><i class="lg-l"></i>${topLbl}<i class="lg-l d"></i>Est. 1RM</span></div>${chart}</div>`:''}
    <p class="h3 mt">All ${VARIANT_META[variant].short.toLowerCase()} sessions</p><div class="xh-list">${histRows(h.slice().reverse(),ex)}</div>
  </div></div>`;
}
function wSheet(id){
  const w=Store.get(id);if(!w)return `<div class="sx"><div class="sx-pad"><p class="first-log">This workout no longer exists.</p></div></div>`;
  const st=wStats(w),d=DAY[w.day],dt=parseISO(w.date),u=S.unit,base=cur.base;
  const fresh=w.finishedAt&&Date.now()-w.finishedAt<10*60000;
  const ex=w.items.map((it,i)=>{const v=itemVariant(it),e=variantProfile(it.ex,v);if(!e)return'';const ds=it.sets.filter(s=>s.d),tag=v!=='primary'?`<span class="variant-mini ${v}">${VARIANT_META[v].short}</span>`:'';
    return `<div class="wx${ds.length?'':' skip'}"><span class="wx-n">${i+1}</span><div class="ex-main"><a class="wx-name" href="#/${base}/x/${it.ex}/${v}"><span>${e.name}</span>${tag}${IC.chev}</a>${e.fa?`<small class="wx-fa" dir="rtl">${e.fa}</small>`:''}<div class="set-chips">${ds.length?ds.map(s=>`<span>${setTxt(s,e)}</span>`).join(''):'<small>Skipped</small>'}</div></div></div>`}).join('');
  return `<div class="sx"><div class="sx-pad">
    <p class="eyebrow">${fresh?'Workout complete':dt.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p>
    <h2 class="sx-title">${d?d.title:'Workout'}</h2>
    <p class="sub">${d?d.focus:''}${w.startedAt?` · ${tm(w.startedAt)}${w.finishedAt?' – '+tm(w.finishedAt):''}`:''}</p>
    <div class="kpis mt-s">
      <div class="kpi"><span>Duration</span><b>${fmtDur(st.dur)}</b></div>
      <div class="kpi"><span>Calories (est.)</span><b>${fmtInt(st.kcal)}<small>kcal</small></b></div>
      <div class="kpi"><span>Volume</span><b>${fmtK(st.vol)}<small>${u}</small></b></div>
      <div class="kpi"><span>Sets</span><b>${st.sets}</b></div>
    </div>
    <p class="h3 mt">Exercises</p><div class="wx-list">${ex}
      <div class="wx abs-line"><span class="wx-n">${w.abs?IC.check:'–'}</span><div class="ex-main"><b>Abs · Six Pack in 30 Days</b><small>${w.abs?'Done':'Not logged'}</small></div></div>
    </div>
    <p class="h3 mt">Duration</p><p class="first-log">Forgot to tap Finish? Correct the duration here and calories update automatically.</p>
    <div class="dur-edit"><label class="fld"><input type="text" inputmode="numeric" id="durIn" value="${st.dur}" aria-label="Duration in minutes"><em>min</em></label><button class="ghost press" data-act="savedur" data-id="${esc(w.id)}">Save</button></div>
    ${w.id===todayId(w.day)&&d&&base==='history'?`<a class="btn-secondary press mt" href="#/${w.day}">Open workout${IC.chev}</a>`:''}
    <button class="danger press mt" data-act="delw" data-id="${esc(w.id)}">${IC.trash} Delete workout</button>
  </div></div>`;
}
const stepper=k=>`<div class="stp"><button data-act="step" data-k="${k}" data-d="-15" aria-label="Decrease">${IC.minus}</button><span class="stp-v" aria-live="polite">${fmt(S[k])}</span><button data-act="step" data-k="${k}" data-d="15" aria-label="Increase">${IC.plus}</button></div>`;
const swHTML=k=>`<button class="sw${S[k]?' on':''}" data-act="toggle" data-k="${k}" role="switch" aria-checked="${!!S[k]}"><i></i></button>`;
const bwTxt=()=>S.unit==='kg'?`${S.bw.toFixed(1)} kg`:`${Math.round(S.bw*2.20462)} lb`;
function syncText(){
  if(!Sync.configured)return 'Cloud setup is not finished yet.';
  if(!Sync.token())return 'This device is not connected yet.';
  if(Sync.status==='error')return 'Could not connect — check the sync code or internet.';
  if(Sync.q.length)return `${Sync.q.length} change${Sync.q.length>1?'s':''} waiting to sync`;
  return Sync.last?`Last synced ${relTime(Sync.last)}`:'Sync code saved on this device';
}
function settingsSheet(){
  const ok='wakeLock' in navigator;
  return `<div class="sx"><div class="sx-pad"><p class="eyebrow">Preferences</p><h2 class="sx-title">Settings</h2>
    <div class="srow"><span><b>Body weight</b><small>Used for calories and assisted-exercise load</small></span><div class="stp"><button data-act="bw" data-d="-1" aria-label="Decrease">${IC.minus}</button><span class="stp-v w" id="bwV" aria-live="polite">${bwTxt()}</span><button data-act="bw" data-d="1" aria-label="Increase">${IC.plus}</button></div></div>
    <div class="srow"><span><b>Weight unit</b><small>Label only, numbers aren't converted</small></span>
      <div class="seg sm" style="--v:${S.unit==='kg'?0:1}"><i class="pill"></i><button data-act="unit" data-v="kg" class="${S.unit==='kg'?'on':''}" aria-pressed="${S.unit==='kg'}">kg</button><button data-act="unit" data-v="lb" class="${S.unit==='lb'?'on':''}" aria-pressed="${S.unit==='lb'}">lb</button></div></div>
    <div class="srow"><span><b>Compound rest</b><small>Plan: 2–3 min</small></span>${stepper('restC')}</div>
    <div class="srow"><span><b>Isolation rest</b><small>Plan: 60–90 s</small></span>${stepper('restI')}</div>
    <div class="srow"><span><b>Timer sound</b><small>Beep when rest is over</small></span>${swHTML('sound')}</div>
    <div class="srow"><span><b>Keep screen awake</b><small>${ok?'Stops your phone dimming mid-workout':'Not supported in this browser'}</small></span>${swHTML('wake')}</div>
    <div class="srow"><span><b>Cloud sync</b><small id="syncTxt">${syncText()}</small></span>${Sync.on?`<button class="ghost press sm-btn" data-act="sync">Sync now</button>`:`<span class="badge">${IC.cloud}${Sync.configured?'Connect':'Setup'}</span>`}</div>
    <div class="cloud-sync">
      ${!Sync.configured?`<p><b>Cloud setup needed</b></p><p>Finish the setup in Supabase, then enter the public Project URL and Publishable key in <code>cloud-config.js</code>. Your existing workout data stays on this device.</p>`:!Sync.token()?`<p><b>Connect this device</b></p><p>Enter the same private sync code on your phone and computer. No email or account is needed.</p><label for="syncCode">Private sync code</label><input class="cloud-input" id="syncCode" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Paste your private sync code" maxlength="200"><button class="btn-primary press cloud-connect" data-act="cloud-connect">Connect this device</button><p class="cloud-msg" id="cloudMsg" aria-live="polite">The code is saved only in this browser. Keep it private.</p>`:`<p><b>Cloud sync is enabled on this device</b></p><p>Workout history stays local too. Disconnecting only removes this device's saved code; it does not delete cloud data.</p><div class="cloud-actions"><button class="ghost press" data-act="sync">${IC.refresh} Sync now</button><button class="ghost press" data-act="cloud-disconnect">Disconnect device</button></div><p class="cloud-msg" id="cloudMsg" aria-live="polite">${Sync.status==='error'?'Connection error. Check the code and internet.':'Use the same code on your other device.'}</p>`}
    </div>
    <div class="sbtns"><button class="ghost press" data-act="export">${IC.download} Back up</button><button class="ghost press" data-act="import">${IC.upload} Restore</button></div>
    <input type="file" id="importFile" accept="application/json,.json" hidden>
    <button class="danger press" data-act="wipe">${IC.trash} Delete all workout history</button>
    <p class="fine">Until sync is connected, your data lives only on this device, so back up now and then. Exercise images from free-exercise-db (public domain).</p>
  </div></div>`;
}
function rulesSheet(){
  const r=(ic,t,p)=>`<div class="rule"><span class="rule-ic">${ic}</span><div><b>${t}</b><p>${p}</p></div></div>`;
  return `<div class="sx"><div class="sx-pad"><p class="eyebrow">Program</p><h2 class="sx-title">Execution rules</h2>
    ${r(IC.flame,'Effort','Main compound lifts: stop with 1–2 reps in reserve (RIR). Isolation exercises: the last set can reach 0–1 RIR. Don\'t regularly take heavy compound lifts to complete failure.')}
    ${r(IC.clock,'Rest','Main compound lifts: 2–3 minutes. Isolation exercises: 60–90 seconds. The rest timer starts automatically when you tick off a set.')}
    ${r(IC.trend,'Progression','When you reach the top of the rep range on all sets, increase the weight slightly (or reduce the assistance on assisted pull-ups). The set log flags this for you next session.')}
    ${r(IC.abs,'Abs','After each workout, continue your Six Pack in 30 Days routine — about 20 minutes, using the same modified version you\'re currently doing.')}
    ${r(IC.info,'What RIR means','Reps in reserve: how many more clean reps you could have done. 2 RIR means you stopped with about two good reps left.')}
  </div></div>`;
}

/* ---------- Router ---------- */
const app=$('#app'),topbar=$('#topbar'),backBtn=$('#backBtn'),brand=$('#brand'),topTitle=$('#topTitle'),root=$('#sheetRoot'),sheet=$('#sheet'),sbody=$('#sheetBody'),timerEl=$('#timer'),dlg=$('#dlg');
backBtn.innerHTML=IC.back;$('#settingsBtn').innerHTML=IC.settings;$('#sheetClose').innerHTML=IC.x;$('#sheetBack').innerHTML=IC.back;$('#tX').innerHTML=IC.x;$('#brandMark').innerHTML=IC.dumbbell;$('#icProg').innerHTML=IC.dumbbell;$('#icHist').innerHTML=IC.chart;
root.inert=true; // a closed sheet must not be focusable

let cur={base:null,sheet:null},sheetOpen=false,sheetKey=null,curTab=0,lastFocus=null;
const scrollMem={},stack=[];let replacing=false,popTo=null;
const H=()=>location.hash&&location.hash!=='#'?location.hash:'#/';
function track(){
  const h=H();
  if(replacing){stack[stack.length-1]=h;replacing=false}
  else if(popTo!=null){stack.length=popTo+1;stack[popTo]=h;popTo=null}
  else if(stack.length>1&&stack[stack.length-2]===h)stack.pop();
  else if(stack[stack.length-1]!==h)stack.push(h);
}
function goUp(target,push){
  if(H()===target)return;
  const top=stack.length-1,k=stack.slice(0,top).lastIndexOf(target);
  if(k>=0){popTo=k;history.go(k-top)}
  else if(push)location.hash=target;
  else{replacing=true;location.replace(target)}
}
function parse(h=H()){
  const seg=h.replace(/^#\/?/,'').split('/').filter(Boolean).map(s=>{try{return decodeURIComponent(s)}catch(e){return s}});
  let base='home',rest=seg;
  if(seg[0]==='history'){base='history';rest=seg.slice(1)}
  else if(seg[0]&&DAY[seg[0]]){base=seg[0];rest=seg.slice(1)}
  const x=rest[0];let sh=null;
  if(x==='settings'||x==='rules')sh={t:x};
  else if(x==='w'&&rest[1]&&Store.get(rest[1]))sh={t:'w',id:rest[1]};
  else if(x==='x'&&rest[1]&&EX[rest[1]])sh={t:'x',id:rest[1],variant:variantKey(rest[2])};
  else if(DAY[base]&&/^\d+$/.test(x||'')&&DAY[base].items[+x])sh={t:'ex',i:+x};
  return{base,sheet:sh};
}
const basePath=b=>b==='home'?'#/':'#/'+b;
function renderBase(base,dir,prevBase){
  if(prevBase)scrollMem[prevBase]=scrollY;
  const isDay=!!DAY[base];
  app.innerHTML=base==='home'?homeView():base==='history'?historyView():dayView(base);
  app.firstElementChild.classList.add(dir);
  backBtn.hidden=!isDay;brand.hidden=isDay;
  topTitle.textContent=isDay?`${DAY[base].day} · ${DAY[base].title}`:base==='history'?'History':'';
  document.title=isDay?`${DAY[base].title} · ${DAY[base].day}`:base==='history'?'History':'4-Day Program';
  $('#tabProg').classList.toggle('on',base!=='history');$('#tabHist').classList.toggle('on',base==='history');
  $('#tabProg').setAttribute('aria-current',base!=='history'?'page':'false');$('#tabHist').setAttribute('aria-current',base==='history'?'page':'false');
  window.scrollTo(0,isDay?0:(scrollMem[base]||0));
  onScroll();
  if(isDay)loadThumbs();
}
function refreshBase(){
  const y=scrollY;
  if(cur.base==='home'||cur.base==='history'){app.innerHTML=cur.base==='home'?homeView():historyView();app.firstElementChild.classList.add('static');window.scrollTo(0,y)}
  else updateDay(cur.base);
}
function restoreFocus(){
  const f=lastFocus;lastFocus=null;if(!f)return;
  let el=f.isConnected?f:null;
  if(!el&&f.getAttribute){const h=f.getAttribute('href');if(h)el=app.querySelector(`[href="${CSS.escape(h)}"]`)}
  if(el&&!sheet.contains(el)&&el.focus)el.focus({preventScroll:true});
}
function route(){
  const r=parse(),prev=cur;cur={base:r.base,sheet:r.sheet};
  if(r.base!==prev.base){const dep=b=>DAY[b]?1:0;renderBase(r.base,prev.base===null?'first':dep(r.base)>dep(prev.base)?'fwd':dep(r.base)<dep(prev.base)?'back':'first',prev.base)}
  if(r.sheet)return openSheet(r);
  if(sheetOpen){closeSheetUI();refreshBase()}
  else if(prev.sheet&&r.base===prev.base)refreshBase();
  restoreFocus();
}
function openSheet(r){
  const t=r.sheet.t,key=t==='ex'?`ex:${r.base}:${r.sheet.i}`:t==='x'?`x:${r.sheet.id}:${r.sheet.variant}`:t==='w'?`w:${r.sheet.id}`:t;
  if(sheetOpen&&key===sheetKey)return;
  const exSwap=sheetOpen&&t==='ex'&&(sheetKey||'').startsWith('ex:');
  const dir=exSwap?(r.sheet.i>+sheetKey.split(':')[2]?'fwd':'back'):(sheetOpen?'swap':'');
  if(t==='ex'&&!exSwap&&!(sheetKey||'').startsWith('x:'))curTab=dayProgress(r.base).done>0?1:0;
  stopMedia();
  sbody.innerHTML=t==='ex'?exSheet(r.base,r.sheet.i,curTab):t==='settings'?settingsSheet():t==='rules'?rulesSheet():t==='w'?wSheet(r.sheet.id):xSheet(r.sheet.id,r.sheet.variant);
  sbody.scrollTop=0;
  if(dir)sbody.firstElementChild.classList.add(dir);
  sheetKey=key;
  const ph=stack[stack.length-2],pr=ph?parse(ph):null,canBack=!!(pr&&pr.sheet&&pr.base===r.base);
  $('#sheetBack').hidden=!canBack;sheet.classList.toggle('has-back',canBack&&t!=='ex');
  if(t==='ex'){const ss=session(r.base,r.sheet.i);setupMedia(DAY[r.base].items[r.sheet.i].ex,itemVariant(ss))}
  if(!sheetOpen){
    lastFocus=document.activeElement;
    sheetOpen=true;root.inert=false;root.setAttribute('aria-hidden','false');document.body.classList.add('lock');
    app.inert=true;topbar.inert=true;$('#tabbar').inert=true;
    requestAnimationFrame(()=>{root.classList.add('open');sheet.focus({preventScroll:true})});
  }
}
function closeSheetUI(){
  if(!sheetOpen)return;
  sheetOpen=false;sheetKey=null;stopMedia();
  if(document.activeElement&&sheet.contains(document.activeElement))document.activeElement.blur();
  root.classList.remove('open');root.setAttribute('aria-hidden','true');root.inert=true;document.body.classList.remove('lock');
  app.inert=false;topbar.inert=false;$('#tabbar').inert=false;
}
function requestClose(){closeSheetUI();goUp(basePath(cur.base))} // route() refreshes the base once the hash changes
function navEx(j){replacing=true;location.replace(`#/${cur.base}/${j}`)}

/* ---------- Actions ---------- */
function ctx(){const day=cur.base,i=cur.sheet.i;return{day,i,it:DAY[day].items[i]}}
function setTab(v){
  curTab=v;
  const sx=$('.sx',sbody),seg=$('.seg',sbody);
  sx.classList.toggle('log',v===1);seg.style.setProperty('--v',v);
  $$('button',seg).forEach(b=>{const on=+b.dataset.v===v;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  $$('.panel',sbody).forEach((p,k)=>{p.hidden=k!==v;if(k===v){p.classList.remove('in');void p.offsetWidth;p.classList.add('in')}});
}
async function setVariant(v){
  v=variantKey(v);const{day,i,it}=ctx(),w=Store.ensure(day),item=w.items[i],old=itemVariant(item);if(v===old)return;
  const touched=item.sets.some(s=>s.d||s.w||s.r);
  if(touched&&!(await ask(`Switch to ${variantProfile(it.ex,v).name}? Logged sets for this exercise will be cleared so history stays accurate.`,'Switch & clear')))return;
  if(touched)item.sets=item.sets.map(()=>({w:'',r:'',d:false,t:null}));
  item.variant=v;Store.touch(w,true);stopMedia();sbody.innerHTML=exSheet(day,i,curTab);setupMedia(it.ex,v);const row=$(`.ex-row[data-i="${i}"]`,app);if(row){row.outerHTML=rowHTML(day,i,nextIdx(day),dayProgress(day).done>0);loadThumbs()}updateDay(day);toast(`Using ${variantProfile(it.ex,v).name} today`);
}
function checkComplete(key){
  const p=dayProgress(key);if(p.done<p.total)return false;
  const w=todayW(key);toast(w&&w.abs?'All done. Tap Finish workout to save it.':'All sets done. Abs next, then tap Finish.');
  return true;
}
function startWorkout(key){const w=Store.ensure(key);if(!w.startedAt){w.startedAt=Date.now();w.finishedAt=null;Store.touch(w,true)}}
async function finishWorkout(key){
  const w=todayW(key),p=dayProgress(key);
  if(!w||!hasActivity(w)){toast('Log at least one set first');return}
  if(p.done<p.total&&!(await ask(`Finish with ${p.done} of ${p.total} sets done?`,'Finish')))return;
  if(!w.startedAt)w.startedAt=Date.now()-60000;
  w.finishedAt=Date.now();w.bw=S.bw;Store.touch(w,true);hideTimer();haptic([20,60,20]);
  location.hash=`#/${key}/w/${w.id}`;
}
function toggleSet(k,btn){
  const{day,i,it}=ctx(),w=Store.ensure(day),s=w.items[i],set=s.sets[k],row=btn.closest('.set-row'),variant=itemVariant(s),ex=variantProfile(it.ex,variant),src=`${w.id}:${i}:${k}`;
  set.d=!set.d;set.t=set.d?Date.now():null;
  if(set.d){
    const wi=$('[data-f="w"]',row),ri=$('[data-f="r"]',row);
    if(!set.w&&wi.dataset.p){set.w=normNum(wi.dataset.p);wi.value=set.w}
    if(!set.r&&ri.dataset.p){set.r=normNum(ri.dataset.p);ri.value=set.r}
    if(set.w)propagateWeight(k,set.w);
    if(!w.startedAt)w.startedAt=Date.now()-60000;
    if(w.finishedAt)w.finishedAt=null;
  }else if(!T.fired&&T.src===src)hideTimer(); // unticking cancels the rest it started
  Store.touch(w,true);
  row.classList.toggle('done',set.d);btn.setAttribute('aria-pressed',set.d);
  const n=doneCount(day,i),all=n>=it.sets;
  $('#logCnt').textContent=`${n}/${it.sets}`;
  const nb=$('.nav-btn.nx',sbody);if(nb)nb.classList.toggle('go',all);
  updateDay(day);
  if(set.d){
    haptic(12);unlockAudio();
    const W=num(set.w),R=num(set.r),c1=e1(load(ex,set.w,w.bw),R);
    let pr=false;
    if(c1>0){
      const before=Math.max(0,...exHistory(it.ex,w.id,variant).map(e=>e.e1));
      const todayB=Math.max(0,...s.sets.filter(x=>x!==set&&x.d).map(x=>e1(load(ex,x.w,w.bw),num(x.r))));
      pr=before>0&&c1>before&&c1>todayB;
    }
    const nxt=DAY[day].items[i+1];
    startTimer(restFor(it),it.ss&&nxt&&nxt.ss===it.ss?`Superset: go to ${selectedProfile(day,i+1).name}`:all?'Rest · next exercise':`Rest · then set ${n+1} of ${it.sets}`,src);
    if(pr){const mode=ex.loadMode||'external',msg=mode==='assist'?`New PR · ${R} reps ${W?`with ${r1(W)} ${S.unit} assist`:'at bodyweight'}`:mode==='bodyweight'?`New PR · ${W?'BW + '+r1(W)+' '+S.unit:'Bodyweight'} × ${R} on ${ex.name}`:`New PR · ${r1(W)} ${S.unit} × ${R} on ${ex.name}`;toast(msg);haptic([30,60,30,60,30])}
    else if(all&&!checkComplete(day))toast(`${ex.name} complete`);
  }
}
function propagateWeight(k,val){
  $$('[data-f="w"]',sbody).forEach(inp=>{const j=+inp.dataset.s;if(j>k&&!inp.value){const v=val||inp.dataset.p0||'';inp.placeholder=v||'–';inp.dataset.p=v}});
}
function exportData(){
  Store.flush();
  const blob=new Blob([JSON.stringify({app:'gp',v:3,exportedAt:new Date().toISOString(),workouts:Store.W,settings:S})],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`workout-backup-${iso()}.json`;
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
  toast('Backup downloaded');
}
function importData(file){
  if(file.size>20*1024*1024){toast('That file is too large to be a backup');return}
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const d=JSON.parse(rd.result);
      if(!d||d.app!=='gp')throw new Error();
      if(d.workouts&&typeof d.workouts==='object')Store.merge(d.workouts,true);
      else if(d.log)migrateLegacy(d.log,d.abs);
      else throw new Error();
      if(d.settings){Object.assign(S,cleanS(Object.assign({},S,d.settings)));Store.saveS()}
      Object.values(Store.W).forEach(w=>{if(hasActivity(w)||w.deleted)Store.dirty.add(w.id)});
      Store.ver++;Store.flush();
      sbody.innerHTML=settingsSheet();toast('Backup restored');
    }catch(e){toast("That file isn't a valid backup")}
  };
  rd.readAsText(file);
}

root.addEventListener('click',async e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const a=el.dataset.act;
  if(a==='close')return requestClose();
  if(a==='sback')return history.back();
  if(a==='tab')return setTab(+el.dataset.v);
  if(a==='variant')return setVariant(el.dataset.v);
  if(a==='check')return toggleSet(+el.dataset.s,el);
  if(a==='nav')return navEx(+el.dataset.to);
  if(a==='rest'){const{day,i,it}=ctx(),ex=selectedProfile(day,i);unlockAudio();return startTimer(restFor(it),'Rest · '+ex.name)}
  if(a==='unit'){S.unit=el.dataset.v==='lb'?'lb':'kg';Store.saveS();const seg=el.parentElement;seg.style.setProperty('--v',S.unit==='kg'?0:1);$$('button',seg).forEach(b=>{const on=b.dataset.v===S.unit;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});$('#bwV').textContent=bwTxt();return}
  if(a==='bw'){const step=S.unit==='kg'?.5:.45359237;S.bw=Math.round(Math.min(250,Math.max(30,S.bw+ +el.dataset.d*step))*100)/100;Store.saveS();$('#bwV').textContent=bwTxt();return}
  if(a==='step'){const k=el.dataset.k,lo=k==='restC'?60:30,hi=k==='restC'?300:180;S[k]=Math.min(hi,Math.max(lo,S[k]+ +el.dataset.d));Store.saveS();$('.stp-v',el.parentElement).textContent=fmt(S[k]);return}
  if(a==='toggle'){const k=el.dataset.k;S[k]=!S[k];Store.saveS();el.classList.toggle('on',S[k]);el.setAttribute('aria-checked',S[k]);if(k==='wake')applyWake();if(k==='sound'&&S.sound){unlockAudio();beep()}return}
  if(a==='cloud-connect'){
    const input=$('#syncCode',sbody),msg=$('#cloudMsg',sbody),code=input?input.value:'';
    if(!code.trim()){if(msg)msg.textContent='Paste your private sync code first.';return}
    el.disabled=true;el.textContent='Connecting…';if(msg)msg.textContent='Checking the code and downloading your cloud data…';
    try{await Sync.connect(code);sbody.innerHTML=settingsSheet();toast('Cloud sync connected on this device');}
    catch(err){Sync.status='error';if(msg)msg.textContent=String(err&&err.message||'Could not connect. Check the code and internet.').slice(0,220);el.disabled=false;el.textContent='Try again';}
    return;
  }
  if(a==='cloud-disconnect'){
    if(!(await ask('Disconnect cloud sync on this device? Your local and cloud workout data will not be deleted.','Disconnect')))return;
    LS.set('gp.token','');Sync.status='idle';sbody.innerHTML=settingsSheet();toast('This device disconnected; workout data kept');return;
  }
  if(a==='sync'){$('#syncTxt').textContent='Syncing…';const ok=await Sync.pull();if(ok)await Sync.flush();const st=$('#syncTxt');if(st)st.textContent=syncText();const m=$('#cloudMsg',sbody);if(m)m.textContent=ok?'Sync check completed.':'Could not sync; check the code and internet.';return}
  if(a==='export')return exportData();
  if(a==='import')return $('#importFile',sbody).click();
  if(a==='savedur'){
    const w=Store.get(el.dataset.id),v=parseInt(normNum($('#durIn',sbody).value),10);if(!w)return;
    if(!(v>0&&v<=600)){toast('Enter minutes between 1 and 600');return}
    w.durOverride=v;Store.touch(w,true);sbody.innerHTML=wSheet(w.id);toast('Duration saved');return;
  }
  if(a==='delw'){
    if(!(await ask('Delete this workout from your history?','Delete',true)))return;
    if(!T.fired&&T.src&&T.src.startsWith(el.dataset.id+':'))hideTimer();
    Store.remove(el.dataset.id);toast('Workout deleted');return requestClose();
  }
  if(a==='wipe'){
    if(!(await ask('Delete all workout history? Back up first if you might want it later.','Delete all',true)))return;
    const now=Date.now();
    Object.values(Store.W).forEach(w=>{if(!w.deleted){w.deleted=true;w.updatedAt=now;Store.dirty.add(w.id)}});
    Store.ver++;Store.flush();hideTimer();toast('History deleted');
  }
});
root.addEventListener('change',e=>{if(e.target.id==='importFile'&&e.target.files[0]){importData(e.target.files[0]);e.target.value=''}});
root.addEventListener('input',e=>{
  const f=e.target.dataset.f;if(!f||!cur.sheet||cur.sheet.t!=='ex')return;
  const{day,i}=ctx(),w=Store.ensure(day),k=+e.target.dataset.s;
  const val=normNum(e.target.value.trim()).slice(0,f==='w'?7:4);
  if(val!==e.target.value)e.target.value=val; // Persian digits / comma → ASCII as you type
  w.items[i].sets[k][f]=val;Store.touch(w);     // debounced save
  if(f==='w')propagateWeight(k,val);
});
root.addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.target.tagName!=='INPUT')return;
  e.preventDefault();
  if(e.target.dataset.f==='w'){const r=$('[data-f="r"]',e.target.closest('.set-row'));if(r)return r.focus()}
  e.target.blur();
});

function selectBar(hit){
  const k=+hit.dataset.k;HV.sel=HV.sel===k?null:k;
  $$('.bar',hit.closest('svg')).forEach(b=>b.classList.toggle('dim',HV.sel!=null&&+b.dataset.k!==HV.sel));
  $('#chartCap',app).innerHTML=capHTML();
}
app.addEventListener('click',e=>{
  const hit=e.target.closest('.hit');
  if(hit)return selectBar(hit);
  const el=e.target.closest('[data-act]');if(!el)return;
  const key=cur.base,a=el.dataset.act;
  if(a==='abs'){
    const w=Store.ensure(key);w.abs=!w.abs;
    if(w.abs&&!w.startedAt)w.startedAt=Date.now()-CONFIG.absMinutes*60000;
    Store.touch(w,true);updateDay(key);
    if(w.abs){haptic(12);checkComplete(key)}
  }
  if(a==='finish')finishWorkout(key);
  if(a==='reset'){
    const w=todayW(key);
    if(!w){toast('Nothing logged today');return}
    ask(`Clear today's log for ${DAY[key].title}?`,'Clear',true).then(ok=>{
      if(!ok)return;
      if(!T.fired&&T.src&&T.src.startsWith(w.id+':'))hideTimer();
      Store.remove(w.id);updateDay(key);toast("Today's log cleared");
    });
  }
  if(a==='range'){HV.range=el.dataset.v;HV.off=0;HV.sel=null;updateHistory()}
  if(a==='poff'){HV.off=Math.min(0,HV.off+ +el.dataset.d);HV.sel=null;updateHistory()}
  if(a==='metric'){HV.metric=el.dataset.v;HV.sel=null;$('#chartBox',app).innerHTML=chartBox()}
  if(a==='tomonth'){HV.range='month';HV.off=+el.dataset.off;HV.sel=null;updateHistory();window.scrollTo({top:0,behavior:RM?'auto':'smooth'})}
});
app.addEventListener('keydown',e=>{
  const hit=e.target.closest&&e.target.closest('.hit');
  if(hit&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectBar(hit)}
});

/* Tabs and the "Start workout" link */
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#/"]');if(!a)return;
  if(a.dataset.tab){
    e.preventDefault();
    const t=a.dataset.tab,target=t==='#/'?'home':'history';
    if(cur.base===target&&!cur.sheet){window.scrollTo({top:0,behavior:RM?'auto':'smooth'});return}
    goUp(t,true);return;
  }
  if(a.dataset.act==='start'&&DAY[cur.base])startWorkout(cur.base);
});

backBtn.addEventListener('click',()=>{if(stack.length>1)history.back();else{replacing=true;location.replace('#/')}});
$('#settingsBtn').addEventListener('click',()=>{location.hash=cur.base==='home'?'#/settings':cur.base==='history'?'#/history/settings':`#/${cur.base}/settings`});

function onScroll(){topbar.classList.toggle('scrolled',scrollY>60)}
addEventListener('scroll',onScroll,{passive:true});

if(dlg)dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close('cancel')});
addEventListener('keydown',e=>{
  if(dlg&&dlg.open)return; // the dialog handles its own Escape
  if(!sheetOpen)return;
  if(e.key==='Escape')return requestClose();
  if(cur.sheet&&cur.sheet.t==='ex'&&document.activeElement.tagName!=='INPUT'){
    const n=DAY[cur.base].items.length;
    if(e.key==='ArrowRight'&&cur.sheet.i<n-1)navEx(cur.sheet.i+1);
    if(e.key==='ArrowLeft'&&cur.sheet.i>0)navEx(cur.sheet.i-1);
  }
});

/* Swipe down to close (mobile) */
let drag=null;
sheet.addEventListener('touchstart',e=>{
  if(innerWidth>=720||e.target.closest('input,.sx-nav'))return;
  if(sbody.scrollTop>0&&!e.target.closest('.grab'))return;
  drag={y:e.touches[0].clientY,dy:0,t:Date.now()};
},{passive:true});
sheet.addEventListener('touchmove',e=>{
  if(!drag)return;
  const dy=e.touches[0].clientY-drag.y;
  if(dy<0&&drag.dy===0){drag=null;return}
  drag.dy=Math.max(0,dy);
  if(drag.dy>6){e.preventDefault();sheet.classList.add('dragging');sheet.style.transform=`translateY(${drag.dy}px)`}
},{passive:false});
sheet.addEventListener('touchend',()=>{
  if(!drag)return;
  const{dy,t}=drag;drag=null;
  const v=dy/Math.max(1,Date.now()-t);
  sheet.classList.remove('dragging');sheet.style.transform='';
  if(dy>130||(v>.6&&dy>40))requestClose();
});

/* ---------- Rest timer (survives reloads and app kills) ---------- */
const T={end:0,dur:1,iv:0,fired:true,hideTo:0,src:null,label:''};
const C40=2*Math.PI*16;
let actx=null;
function unlockAudio(){try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume()}catch(e){}}
function beep(){
  if(!actx)return;
  const t=actx.currentTime;
  [0,.24,.48].forEach((o,j)=>{
    const osc=actx.createOscillator(),g=actx.createGain();
    osc.type='sine';osc.frequency.value=j===2?1320:880;
    g.gain.setValueAtTime(.0001,t+o);g.gain.exponentialRampToValueAtTime(.3,t+o+.02);g.gain.exponentialRampToValueAtTime(.0001,t+o+.2);
    osc.connect(g).connect(actx.destination);osc.start(t+o);osc.stop(t+o+.22);
  });
}
function saveTimer(){LS.set('gp.timer',T.fired?null:{end:T.end,dur:T.dur,label:T.label,src:T.src})}
function runTimer(end,dur,label,src){
  clearTimeout(T.hideTo);clearInterval(T.iv);
  Object.assign(T,{end,dur,label,src:src||null,fired:false});
  $('#tLabel').textContent=label;
  timerEl.classList.remove('done');timerEl.classList.add('show');document.body.classList.add('timing');
  saveTimer();
  T.iv=setInterval(tick,250);tick();
}
function startTimer(sec,label,src){runTimer(Date.now()+sec*1000,sec,label,src)}
function tick(){
  if(T.fired)return;
  const left=Math.max(0,T.end-Date.now());
  $('#tTime').textContent=fmt(Math.ceil(left/1000));
  $('#tFg').style.strokeDashoffset=(C40*(1-left/(T.dur*1000))).toFixed(2);
  if(left<=0){
    T.fired=true;clearInterval(T.iv);saveTimer();
    timerEl.classList.add('done');$('#tLabel').textContent='Rest over. Next set.';
    haptic([220,120,220]);if(S.sound)beep();
    T.hideTo=setTimeout(hideTimer,6000);
  }
}
function hideTimer(){clearInterval(T.iv);clearTimeout(T.hideTo);T.fired=true;T.src=null;saveTimer();timerEl.classList.remove('show','done');document.body.classList.remove('timing')}
timerEl.addEventListener('click',e=>{
  const b=e.target.closest('[data-t]');if(!b)return;
  const v=b.dataset.t;
  if(v==='x')return hideTimer();
  const d=+v;
  if(T.fired){if(d>0)startTimer(d,'Extra rest');return}
  T.end=Math.max(Date.now(),T.end+d*1000);T.dur=Math.max(1,T.dur+d);saveTimer();tick();
});

/* ---------- Screen wake lock ---------- */
let wl=null;
async function applyWake(){
  try{
    if(S.wake&&document.visibilityState==='visible'&&'wakeLock' in navigator){
      if(!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>{wl=null})}
    }else if(wl){await wl.release();wl=null}
  }catch(e){}
}

/* ---------- Init ---------- */
if('scrollRestoration' in history)history.scrollRestoration='manual';
addEventListener('hashchange',()=>{track();route()});
addEventListener('online',()=>{Sync.flush();Sync.pull()});
addEventListener('pagehide',()=>Store.flush());
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){Store.flush();return}
  applyWake();
  if(!T.fired)tick();
  if(!sheetOpen)refreshBase(); // picks up date changes (e.g. after midnight)
});
/* Another tab changed the data */
addEventListener('storage',e=>{
  if(e.key==='gp.workouts'){if(Store.merge(LS.get('gp.workouts',{}))&&!sheetOpen)refreshBase()}
  else if(e.key==='gp.settings'){Object.assign(S,cleanS(LS.get('gp.settings',{})));Store.ver++;if(!sheetOpen)refreshBase()}
});
setInterval(()=>{
  const el=$('#elapsed');if(!el||!DAY[cur.base])return;
  const w=todayW(cur.base);
  if(w&&w.startedAt)el.textContent='In progress · '+fmtDur((Date.now()-w.startedAt)/60000);
},20000);
stack.push(H());
route();
applyWake();
(()=>{const st=LS.get('gp.timer',null);if(st&&+st.end>Date.now()+500)runTimer(+st.end,+st.dur||1,String(st.label||'Rest'),st.src);else LS.set('gp.timer',null)})();
if(Sync.on){
  Sync.pull().then(ok=>{if(ok)Sync.flush()});
}
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW registration failed',e)));
window.GymApp={Store,Sync,CONFIG};