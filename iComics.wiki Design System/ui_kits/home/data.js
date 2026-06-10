// iComics.wiki — sample catalog data for the Home kit (titles are real catalog
// entries; covers are placeholders except the hero banner/cover).
window.ICW_DATA = (function () {
  const t = (title, opts = {}) => Object.assign({ title, source: "MangaDex", status: "Ongoing", rating: "safe" }, opts);

  const featured = [
    {
      title: "Byeoreul Pumeun Swordmaster",
      source: "MangaDex", status: "Ongoing", score: 8.2, rating: "safe",
      blurb: "A fallen swordmaster swallows a dying star and is reborn with the strength to rewrite his ruin — a manhwa of slow revenge and quiet resolve.",
      banner: "https://s4.anilist.co/file/anilistcdn/media/manga/banner/170400-EgLAQtqhdQAx.jpg",
      cover: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx170400-yMIuOIboWuoO.jpg",
      hue: 28,
    },
    {
      title: "Tongari Boushi no Atelier",
      source: "MangaDex", status: "Ongoing", score: 8.7, rating: "safe",
      blurb: "In a world where magic is drawn, not spoken, a girl who saw something she shouldn't have is taken in by a witch — and learns the cost of every spell.",
      hue: 200,
    },
    {
      title: "Hwasangwihwan",
      source: "MangaDex", status: "Ongoing", score: 8.4, rating: "suggestive",
      blurb: "A grandmaster returns to his youth at the foot of the mountain sect that made him — and sets out to do it all better the second time.",
      hue: 150,
    },
  ];

  const romance = [
    t("Sono Bisque Doll wa Koi o Suru", { status: "Completed", rating: "suggestive", score: 8.1 }),
    t("Kaoru Hana wa Rin to Saku", { score: 8.5 }),
    t("Komi-san wa Komyushou Desu.", { status: "Completed", score: 8.0 }),
    t("Ki ni Natteru Hito ga Otoko ja Nakatta", { score: 8.3 }),
    t("Ijiranaide, Nagatoro-san", { status: "Completed", rating: "suggestive", score: 7.4 }),
    t("Kusuriya no Hitorigoto", { rating: "suggestive", score: 9.0 }),
    t("Mairimashita! Iruma-kun", { score: 7.8 }),
    t("Otome Game Sekai wa Mob ni Kibishii Sekai desu", { status: "Completed", rating: "suggestive", score: 7.6 }),
    t("Dosanko Gal wa Namara Menkoi", { status: "Completed", rating: "suggestive", score: 7.2 }),
  ];

  const fantasy = [
    t("Tate no Yuusha no Nariagari", { score: 7.9 }),
    t("The New Gate", { score: 7.7 }),
    t("Tensei Shitara Ken deshita", { rating: "suggestive", score: 8.0 }),
    t("Tondemo Skill de Isekai Hourou Meshi", { score: 7.9 }),
    t("A Returner's Magic Should Be Special", { status: "Completed", score: 8.1 }),
    t("Shuumatsu no Valkyrie", { rating: "suggestive", score: 7.6 }),
    t("Sekai Saikou no Ansatsusha", { rating: "suggestive", score: 7.8 }),
    t("Hitoribocchi no Isekai Kouryaku", { rating: "suggestive", score: 7.5 }),
  ];

  const drama = [
    t("Attack on Titan", { status: "Completed", score: 9.0 }),
    t("Kaiju No. 8", { status: "Completed", score: 8.2 }),
    t("Kanojo, Okarishimasu", { rating: "suggestive", score: 6.9 }),
    t("Watashi no Oshi wa Akuyaku Reijou.", { rating: "suggestive", score: 7.7 }),
    t("Boushoku no Berserk", { score: 7.5 }),
    t("Tensei Oujo to Tensai Reijou no Mahou Kakumei", { score: 8.0 }),
    t("Haimiya-senpai wa Kowakute Kawaii", { score: 7.3 }),
  ];

  const trending = [
    t("Choujin X", { status: "Trending #10", score: 7.6 }),
    t("Shangri-La Frontier", { status: "Trending #11", score: 8.1 }),
    t("Eleceed", { status: "Trending #7", score: 8.5 }),
    t("Blue Lock", { status: "Trending #4", score: 8.2 }),
    t("Muhanui Mabeopsa", { status: "Trending #3", score: 7.8 }),
    t("Myeolmang Ihuui Segye", { status: "Trending #8", score: 7.6 }),
    t("Hoegwihan Yongbyeongeun Da Gyehoegi Itda", { status: "Trending #6", score: 8.0 }),
  ];

  const mangaHub = [
    t("Sousou no Frieren", { status: "Hiatus", score: 8.9 }),
    t("Tensei Shitara Slime datta Ken", { score: 8.2 }),
    t("Jujutsu Kaisen", { status: "Completed", rating: "suggestive", score: 8.6 }),
    t("Chainsaw Man", { status: "Completed", rating: "suggestive", score: 8.7 }),
    t("One Punch-Man", { rating: "suggestive", score: 8.8 }),
    t("Kage no Jitsuryokusha ni Naritakute!", { score: 8.0 }),
    t("Mieruko-chan", { score: 7.8 }),
    t("Kumo desu ga, Nani ka?", { score: 7.6 }),
  ];

  const fresh = [
    t("Mazoku no Musumetachi to Okuru Midareta Isekai Seikatsu", { rating: "suggestive" }),
    t("Itsumo no Coffee de Yoroshii desu ka?", { status: "Completed" }),
    t("Moto Saikyou Boukensha no Rojiura Caffe", {}),
    t("Kamikakushi no Kaerimichi", {}),
    t("Donuts wa Circus", { status: "Completed" }),
    t("Maju no Taisai", { status: "Completed" }),
    t("Lone-AU", {}),
  ];

  const manhwa = [
    t("Unintentional Love Story", { status: "Completed" }),
    t("I Will Seduce the Northern Duke", { status: "Completed" }),
    t("Emperor, Stay Here", { status: "Completed" }),
    t("Yongbi the Invincible", { status: "Completed" }),
    t("Skill of Lure", { status: "Completed", rating: "suggestive" }),
    t("Off Limits!", {}),
    t("The Kind Older Sister Is No More", { status: "Completed" }),
  ];

  const webtoons = [
    t("This Villainess Wants a Divorce!", { status: "Completed" }),
    t("Roxana", { status: "Hiatus" }),
    t("The Lady and the Beast", { status: "Completed" }),
    t("Dungeon Reset", { status: "Completed" }),
    t("The Max Level Hero Strikes Back", {}),
    t("Latna Saga: Survival of a Sword King", {}),
    t("Ibeon Saengeun Gajuga Doegetseumnida", {}),
  ];

  const adult = [
    t("Doujinshi — Spring Collection", { source: "nhentai", rating: "erotica", adult: true }),
    t("After Hours vol. 2", { source: "nhentai", rating: "erotica", adult: true }),
    t("Booru Gallery — Selected", { source: "booru", rating: "erotica", adult: true }),
    t("Late Night Anthology", { source: "nhentai", rating: "erotica", adult: true }),
    t("Midnight Doujin", { source: "nhentai", rating: "erotica", adult: true }),
    t("Crimson Pages", { source: "booru", rating: "erotica", adult: true }),
  ];

  const continueReading = [
    { title: "Sousou no Frieren", source: "MangaDex", chapter: "Ch. 92", progress: 62, rating: "safe" },
    { title: "Blue Lock", source: "MangaDex", chapter: "Ch. 241", progress: 28, rating: "suggestive" },
    { title: "Eleceed", source: "MangaDex", chapter: "Ch. 318", progress: 88, rating: "safe" },
    { title: "Jujutsu Kaisen", source: "MangaDex", chapter: "Ch. 142", progress: 45, rating: "suggestive" },
    { title: "Kaiju No. 8", source: "MangaDex", chapter: "Ch. 51", progress: 12, rating: "safe" },
  ];

  // "More titles" infinite grid pool
  const grid = [].concat(mangaHub, manhwa, webtoons, fantasy, drama, fresh)
    .map((x, i) => Object.assign({}, x, { _k: "g" + i }));

  const shelves = [
    { id: "romance",  eyebrow: "Reader picks",         heading: "Romance",   items: romance },
    { id: "fantasy",  eyebrow: "Adventure reads",      heading: "Fantasy",   items: fantasy },
    { id: "drama",    eyebrow: "Emotional storytelling", heading: "Drama",   items: drama },
    { id: "trending", eyebrow: "Popular now",          heading: "Trending",  items: trending },
    { id: "foryou",   eyebrow: "Tuned to your reading", heading: "For you",  items: shuffleSeed(mangaHub.concat(romance).slice(0, 8)), personalized: true },
    { id: "manga",    eyebrow: "Japanese comics",      heading: "Manga Hub", items: mangaHub },
    { id: "new",      eyebrow: "Recently added",       heading: "New",       items: fresh },
    { id: "manhwa",   eyebrow: "Korean comics",        heading: "Manhwa",    items: manhwa },
    { id: "webtoons", eyebrow: "Vertical reads",       heading: "Webtoons",  items: webtoons },
    { id: "adult",    eyebrow: "Mature · age-verified", heading: "Doujinshi", items: adult, adultOnly: true },
  ];

  function shuffleSeed(arr) {
    const a = arr.slice(); let s = 7;
    for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  return { featured, shelves, continueReading, grid };
})();
