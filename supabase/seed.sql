insert into public.communities (
  id, name, district, address, average_price, price_range, intro, map_x, map_y, lng, lat, amenities
) values
(
  'river-garden',
  '滨江云境',
  '滨江区',
  '江南大道与闻涛路交会处',
  '约 5.8 万/㎡',
  '总价约 520-760 万',
  '靠近江景步道和地铁站，适合希望通勤方便、周末能散步放松的家庭。页面内容为示意内容，不代表真实房源。',
  61,
  39,
  120.199,
  30.209,
  $$[
    {"kind":"交通","name":"江畔路地铁站","distance":"约 650m"},
    {"kind":"学校","name":"滨江实验学校","distance":"约 900m"},
    {"kind":"商业","name":"星光生活广场","distance":"约 1.1km"},
    {"kind":"医疗","name":"滨江综合门诊","distance":"约 1.4km"},
    {"kind":"公园","name":"江岸慢行公园","distance":"约 500m"}
  ]$$::jsonb
),
(
  'forest-court',
  '森屿里',
  '西湖区',
  '文二西路与绿汀路附近',
  '约 4.9 万/㎡',
  '总价约 430-680 万',
  '周边公园和学校资源较多，生活氛围安静，适合重视居住舒适度和孩子成长环境的家庭。',
  34,
  28,
  120.053,
  30.275,
  $$[
    {"kind":"交通","name":"绿汀路公交枢纽","distance":"约 480m"},
    {"kind":"学校","name":"文澜小学","distance":"约 760m"},
    {"kind":"商业","name":"西溪印象城","distance":"约 1.5km"},
    {"kind":"医疗","name":"社区健康中心","distance":"约 820m"},
    {"kind":"公园","name":"西溪湿地入口","distance":"约 1.2km"}
  ]$$::jsonb
),
(
  'metro-park',
  '都会澜庭',
  '上城区',
  '秋涛路与庆春东路交会处',
  '约 6.2 万/㎡',
  '总价约 590-920 万',
  '城市中心配套成熟，地铁、商场和医院都比较近，适合看重通勤和生活便利的人群。',
  72,
  61,
  120.193,
  30.264,
  $$[
    {"kind":"交通","name":"庆春广场地铁站","distance":"约 420m"},
    {"kind":"学校","name":"采荷二小","distance":"约 980m"},
    {"kind":"商业","name":"城市生活中心","distance":"约 360m"},
    {"kind":"医疗","name":"市一医院东院区","distance":"约 1.3km"},
    {"kind":"公园","name":"市民休闲广场","distance":"约 700m"}
  ]$$::jsonb
)
on conflict (id) do update set
  name = excluded.name,
  district = excluded.district,
  address = excluded.address,
  average_price = excluded.average_price,
  price_range = excluded.price_range,
  intro = excluded.intro,
  map_x = excluded.map_x,
  map_y = excluded.map_y,
  lng = excluded.lng,
  lat = excluded.lat,
  amenities = excluded.amenities,
  updated_at = now();

insert into public.buildings (
  id, community_id, name, cover, intro, main_layouts, price_range
) values
(
  'river-one',
  'river-garden',
  '云境 1 期',
  '江景高层 / 南向阳台',
  '主打改善型三房和紧凑四房，公共空间更开阔，适合想兼顾家庭活动和独立房间的用户。',
  '三室两厅、四室两厅',
  '约 520-760 万'
),
(
  'river-two',
  'river-garden',
  '云境 2 期',
  '低密楼栋 / 园林中庭',
  '楼栋间距更舒展，户型以方正实用为主，适合希望居住安静、视野舒服的家庭。',
  '两室两厅、三室两厅',
  '约 490-710 万'
),
(
  'forest-one',
  'forest-court',
  '森屿雅苑',
  '公园旁 / 低楼层友好',
  '户型强调收纳和动线，客餐厅连在一起，日常打扫和照看孩子都比较顺手。',
  '两室一厅、三室两厅',
  '约 430-680 万'
),
(
  'metro-one',
  'metro-park',
  '澜庭中心',
  '核心商圈 / 双地铁',
  '适合城市通勤人群，楼下生活配套集中，小面积户型也能保留完整客餐厅。',
  '两室两厅、三室两厅',
  '约 590-920 万'
)
on conflict (id) do update set
  community_id = excluded.community_id,
  name = excluded.name,
  cover = excluded.cover,
  intro = excluded.intro,
  main_layouts = excluded.main_layouts,
  price_range = excluded.price_range,
  updated_at = now();

insert into public.layouts (
  id, building_id, name, area, rooms, orientation, price_range, thumbnail, suitable_for, highlights, floor_plan
) values
(
  'river-89',
  'river-one',
  '江景 89㎡ 三室两厅',
  '89㎡',
  '三室两厅一卫',
  '南向',
  '约 520-590 万',
  '客厅连阳台，三开间朝南',
  '适合三口之家，或者需要一间书房的年轻家庭。',
  array[
    '客厅和阳台连在一起，白天采光更舒服。',
    '厨房靠近餐厅，做饭、端菜和收拾都比较顺。',
    '三个房间分区清楚，主卧、儿童房、书房互不打扰。'
  ],
  $$[
    {"label":"客厅","x":35,"y":38,"width":38,"height":27},
    {"label":"阳台","x":35,"y":66,"width":38,"height":11},
    {"label":"主卧","x":8,"y":18,"width":25,"height":27},
    {"label":"次卧","x":74,"y":18,"width":18,"height":24},
    {"label":"书房","x":74,"y":44,"width":18,"height":19},
    {"label":"厨房","x":8,"y":52,"width":19,"height":18},
    {"label":"卫浴","x":8,"y":72,"width":19,"height":14}
  ]$$::jsonb
),
(
  'river-118',
  'river-one',
  '观澜 118㎡ 四室两厅',
  '118㎡',
  '四室两厅两卫',
  '南北通透',
  '约 680-760 万',
  '双卫设计，南北通风',
  '适合三代同住，或希望保留客房和独立书房的家庭。',
  array[
    '南北都有窗，开窗后空气流动更顺畅。',
    '两个卫生间能减少早晚高峰排队。',
    '客餐厅横向展开，家人活动空间更宽。'
  ],
  $$[
    {"label":"客厅","x":32,"y":35,"width":42,"height":28},
    {"label":"餐厅","x":32,"y":65,"width":24,"height":18},
    {"label":"主卧","x":7,"y":16,"width":23,"height":27},
    {"label":"老人房","x":76,"y":16,"width":18,"height":24},
    {"label":"儿童房","x":76,"y":43,"width":18,"height":20},
    {"label":"书房","x":58,"y":66,"width":16,"height":17},
    {"label":"厨房","x":7,"y":51,"width":19,"height":17},
    {"label":"双卫","x":7,"y":71,"width":19,"height":16}
  ]$$::jsonb
),
(
  'river-76',
  'river-two',
  '晴川 76㎡ 两室两厅',
  '76㎡',
  '两室两厅一卫',
  '东南向',
  '约 490-540 万',
  '两房紧凑，收纳完整',
  '适合首次置业、两人居住或小家庭过渡。',
  array[
    '面积不大但客餐厅完整，日常起居不局促。',
    '卧室分布在两侧，休息区更安静。',
    '入户旁有收纳位，鞋柜和杂物更好放。'
  ],
  $$[
    {"label":"客厅","x":34,"y":37,"width":36,"height":28},
    {"label":"阳台","x":34,"y":67,"width":36,"height":10},
    {"label":"主卧","x":9,"y":19,"width":22,"height":25},
    {"label":"次卧","x":73,"y":20,"width":18,"height":24},
    {"label":"厨房","x":10,"y":53,"width":18,"height":17},
    {"label":"卫浴","x":73,"y":51,"width":18,"height":15}
  ]$$::jsonb
),
(
  'forest-82',
  'forest-one',
  '森氧 82㎡ 三室一厅',
  '82㎡',
  '三室一厅一卫',
  '南向',
  '约 430-500 万',
  '三房小面积，功能齐全',
  '适合预算清晰、但仍希望有独立书房的家庭。',
  array[
    '三间房都能独立使用，居住和办公更灵活。',
    '客厅朝南，日常活动区更明亮。',
    '厨房靠近入户，买菜回家后收纳更方便。'
  ],
  $$[
    {"label":"客厅","x":33,"y":38,"width":35,"height":29},
    {"label":"主卧","x":8,"y":18,"width":23,"height":27},
    {"label":"儿童房","x":71,"y":20,"width":20,"height":23},
    {"label":"书房","x":71,"y":47,"width":20,"height":18},
    {"label":"厨房","x":8,"y":52,"width":18,"height":17},
    {"label":"卫浴","x":8,"y":72,"width":18,"height":14}
  ]$$::jsonb
),
(
  'forest-105',
  'forest-one',
  '林间 105㎡ 三室两厅',
  '105㎡',
  '三室两厅两卫',
  '南北通透',
  '约 560-680 万',
  '宽厅双卫，改善友好',
  '适合想改善居住品质、看重主卧舒适度的家庭。',
  array[
    '主卧带独立卫浴，早晚使用更从容。',
    '客餐厅在中间，家人互动更自然。',
    '两个次卧面积接近，孩子房和客房都好安排。'
  ],
  $$[
    {"label":"客厅","x":31,"y":35,"width":42,"height":29},
    {"label":"餐厅","x":32,"y":66,"width":22,"height":17},
    {"label":"主卧","x":7,"y":15,"width":23,"height":30},
    {"label":"次卧","x":76,"y":17,"width":18,"height":23},
    {"label":"儿童房","x":76,"y":44,"width":18,"height":21},
    {"label":"厨房","x":7,"y":53,"width":19,"height":16},
    {"label":"双卫","x":7,"y":72,"width":19,"height":15}
  ]$$::jsonb
),
(
  'metro-92',
  'metro-one',
  '都会 92㎡ 三室两厅',
  '92㎡',
  '三室两厅一卫',
  '西南向',
  '约 590-660 万',
  '城市景观，动线清楚',
  '适合通勤族和需要兼顾居家办公的人群。',
  array[
    '客餐厅相连，空间看起来更完整。',
    '书房靠近客厅，办公和照看家人都方便。',
    '卧室区相对集中，晚上休息更安静。'
  ],
  $$[
    {"label":"客厅","x":34,"y":36,"width":39,"height":29},
    {"label":"阳台","x":34,"y":67,"width":39,"height":10},
    {"label":"主卧","x":8,"y":18,"width":23,"height":28},
    {"label":"次卧","x":75,"y":18,"width":18,"height":23},
    {"label":"书房","x":75,"y":45,"width":18,"height":18},
    {"label":"厨房","x":8,"y":54,"width":18,"height":16},
    {"label":"卫浴","x":8,"y":73,"width":18,"height":14}
  ]$$::jsonb
),
(
  'metro-128',
  'metro-one',
  '天际 128㎡ 四室两厅',
  '128㎡',
  '四室两厅两卫',
  '南北通透',
  '约 820-920 万',
  '大横厅，独立家政角',
  '适合改善型家庭，尤其是需要更多储物和独立工作区的人。',
  array[
    '大横厅让客厅、餐厅和阳台连成一体，聚会更舒服。',
    '家政角能放洗烘设备，日常收纳更整齐。',
    '四个房间用途灵活，可做客房、书房或儿童房。'
  ],
  $$[
    {"label":"横厅","x":28,"y":34,"width":48,"height":31},
    {"label":"阳台","x":28,"y":68,"width":48,"height":11},
    {"label":"主卧","x":7,"y":14,"width":21,"height":29},
    {"label":"老人房","x":78,"y":15,"width":17,"height":23},
    {"label":"儿童房","x":78,"y":42,"width":17,"height":21},
    {"label":"书房","x":58,"y":68,"width":18,"height":17},
    {"label":"厨房","x":7,"y":51,"width":18,"height":17},
    {"label":"双卫","x":7,"y":72,"width":18,"height":16}
  ]$$::jsonb
)
on conflict (id) do update set
  building_id = excluded.building_id,
  name = excluded.name,
  area = excluded.area,
  rooms = excluded.rooms,
  orientation = excluded.orientation,
  price_range = excluded.price_range,
  thumbnail = excluded.thumbnail,
  suitable_for = excluded.suitable_for,
  highlights = excluded.highlights,
  floor_plan = excluded.floor_plan,
  updated_at = now();

insert into public.decor_styles (key, name, description, wall, floor, accent) values
(
  'modern',
  '现代简约',
  '清爽浅灰墙面、木色地板和少量黑色线条，整体干净利落。',
  '#f1f5f2',
  '#c99f6b',
  '#2f4b3f'
),
(
  'cream',
  '温馨奶油风',
  '柔和米白墙面、浅木家具和暖色灯光，空间显得放松亲切。',
  '#f7efe2',
  '#dcbf91',
  '#b77f54'
),
(
  'luxury',
  '轻奢风',
  '暖灰墙面、深色木地板和金属点缀，适合喜欢精致感的家庭。',
  '#e8e2d8',
  '#6d5645',
  '#9d7a3d'
)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  wall = excluded.wall,
  floor = excluded.floor,
  accent = excluded.accent;
