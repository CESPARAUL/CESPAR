// Content sourced from the legacy WordPress site (cespar.space), preserved and
// restructured for the new build. See /docs/wordpress-content-dump.txt in the
// project root for the raw scrape this was derived from.

export const siteMeta = {
  name: "CESPAR",
  fullName: "Centre for Space Research",
  institution: "Anchor University Lagos",
  tagline: "Exploring the Cosmos, Expanding the Future.",
  description:
    "Centre for Space Research (CESPAR), Anchor University Lagos, advances atmospheric, solar-terrestrial and radio science research through ground-based facilities, open data and collaborative research.",
  email: "info@cespar.space",
  phone: "+234 (0)8125541920",
  whatsapp: "+234 703 341 2059",
  hours: "Mon - Sat: 9:00am - 7:00pm",
  address:
    "Faculty of Science Building, Anchor University Lagos, #1-3, Ayobo - Ipaja Road, Lagos State, Nigeria, West Africa",
};

export const primaryNav = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About CESPAR", href: "/about#cespar" },
      { label: "About Anchor University", href: "/about#aul" },
      { label: "Our Team", href: "/team" },
    ],
  },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "Bulletins", href: "/bulletins" },
  // { label: "Request Data", href: "/request-data" },
  { label: "Contact", href: "/contact" },
];

export const heroContent = {
  badge: "Live Space Weather Monitoring",
  headlineStart: "We study and collect",
  headlineAccent: "space data",
  headlineEnd: "to help life on Earth",
  body: "CESPAR runs science stations at Anchor University Lagos that watch the sky and space weather. We share what we learn with students, researchers and schools who need it.",
  primaryCta: { label: "Request Data", href: "/request-data" },
  secondaryCta: { label: "See our research", href: "/research" },
};

// The full video library — shown on /videos. Add, remove or reorder entries
// here (accepts any standard YouTube link: youtu.be/... or
// youtube.com/watch?v=...) to update both that page and the homepage
// "Latest News" feature below.
export const videos: { title: string; youtubeUrl: string }[] = [
  { title: "Our Journey to Space", youtubeUrl: "https://youtu.be/voNmpV_Jqjg" },
  {
    title: "VC's RETURN To The AUL Space Lab",
    youtubeUrl: "https://youtu.be/iPBmM3u-Gfk",
  },
  { title: "Visits to the Lab", youtubeUrl: "https://youtu.be/XjqqQqhG4uY" },
];

// The homepage "Latest News" section always features `videos[0]` — reorder
// `videos` above to change it.
export const latestNews = {
  eyebrow: "Latest News",
  description:
    "A look at our facilities, research and people in the field — updated from time to time.",
};

export const capabilities = [
  {
    key: "archive",
    title: "Data Archive",
    description:
      "We store space data from all our stations, safely and long-term.",
  },
  {
    key: "radio",
    title: "Radio & Weather Sensors",
    description:
      "Tools that track weather and radio signals in the sky, all day.",
  },
  {
    key: "satellite",
    title: "Satellite Data",
    description:
      "Data used for GPS, communication, weather, and watching Earth.",
  },
  {
    key: "magnetometer",
    title: "Magnetometer Data",
    description:
      "We track Earth's magnetic field to study geomagnetic and space weather activity.",
  },
  {
    key: "exploration",
    title: "Space Exploration",
    description: "We study space using astronomy, robots, and spacecraft.",
  },
];

export const aboutCespar = {
  title: "About CESPAR",
  paragraphs: [
    "CESPAR is a space research centre at Anchor University Lagos. We built our own ground stations to study the sky above us — things like radio waves, weather, and activity from the sun — because Nigeria didn't have much local data on these before.",
    "Our goal is to grow space science in Nigeria and across Africa. We share what we learn and collaborate with researchers and students everywhere.",
  ],
  photo: {
    src: "/images/about/lab-session.jpg",
    caption:
      "Dr. V.U.J. Nwankwo, Lead Scientist, leading a session with students at the Space Lab.",
  },
};

export const aboutMilestones = {
  title: "Launch & International Partnership",
  paragraphs: [
    "CESPAR was officially launched on 13 December 2022, upgrading what had previously operated as a laboratory for Space and Radio Wave Propagation into a fully-fledged research centre.",
    "In November 2022, Dr. V.U.J. Nwankwo visited the Dublin School of Advanced Studies in Maryland, Ireland, establishing a partnership for the advancement of space science research at CESPAR. The visit led to the donation of a magnetometer and radio antenna, facilitated by Prof. Jackman and Khamilia, to support CESPAR's mission of exploring the space environment for the benefit of humanity.",
    "The equipment was presented on behalf of the Physics Department by HOD Prof. Olumide Akinwumi, and received by the Vice Chancellor of Anchor University Lagos, Prof. S. O. Bandele, on behalf of the Chancellor, Board of Trustees and council members — joined by the Dean of the Faculty of Natural, Applied and Health Science, Prof. K. V. F. Fatokun.",
  ],
  photos: [
    {
      src: "/images/about/cespar-launch.jpg",
      caption: "CESPAR officially launched, 13 December 2022.",
    },
    {
      src: "/images/about/donation-handover.jpg",
      caption:
        "VC Prof. S. O. Bandele receives the donated magnetometer and radio antenna.",
    },
    {
      src: "/images/about/donation-team.jpg",
      caption: "CESPAR staff at the donation ceremony.",
    },
  ],
};

export const aboutPower = {
  title: "Uninterrupted Power at the Lab",
  paragraphs: [
    "Unreliable electricity was a challenge at the Space Lab from the start — power surges and outages risked damaging equipment and left gaps in the data collected around the clock from our VLF radio wave receiver.",
    "To keep the lab running without downtime, we installed an inverter system, solar panels and a stand-by generator. A 1kVA inverter was acquired in 2019, later upgraded to 2.5kVA as equipment expanded, alongside a 4.5kVA generator for extended outages.",
    "In February 2022, solar panels were added to support the inverter system. With solar power now in place, the lab enjoys 24-hour power and uninterrupted data collection.",
  ],
  heroPhoto: {
    src: "/images/about/power-roof1.jpg",
    caption: "Installing solar panels on the Space Lab's roof.",
  },
  photos: [
    {
      src: "/images/about/power-inverter.jpg",
      caption: "The inverter system installed at CESPAR.",
    },
    {
      src: "/images/about/power-solar_left.jpg",
      caption: "The research team fitting a solar panel.",
    },
    {
      src: "/images/about/power-solar_right.jpg",
      caption: "Preparing panels for installation.",
    },
    {
      src: "/images/about/power-roof2.jpg",
      caption: "The team installing the solar panel system for the lab.",
    },
  ],
};

export const aboutMemoriam = {
  title: "In Memoriam: Paul Anekwe (1977–2022)",
  paragraphs: [
    "It is with a heavy heart that we remember Mr. Paul Izuchukwu Anekwe, who passed away on 12 June 2022. Paul was the Principal System Developer in charge of CESPAR's website and database, and Chairman of Project Finance and Procurement for the SCOSTEP/PRESTO Grant awarded to the lab — playing a significant role in the grant's successful application in 2021.",
    "He held a first degree in Computer Science from the University of Nigeria, Nsukka, and a master's in Information Engineering from Robert Gordon University, Aberdeen, and was preparing to begin a PhD at the University of Quebec at Montreal at the time of his passing. He is deeply missed by the Centre and the wider university community.",
  ],
  photo: {
    src: "/images/about/anekwe-memoriam.jpg",
    caption: "Mr. Paul Izuchukwu Anekwe at the Space Lab.",
  },
  tribute: {
    quote:
      "You are like a city that is set on a hill. You lived, you won, you conquered, and you continue to conquer.",
    attribution: "Dr. V.U.J. Nwankwo",
  },
};

export const aboutAUL = {
  title: "About Anchor University Lagos",
  paragraphs: [
    "The mandate of Anchor University is straightforward: raising young men and women who are academically sound and spiritually vibrant for national and global transformation.",
    "Anchor University is a unique university born in due time to address the gaps in quality education in Nigeria and beyond — focused on raising exceptional leaders across different walks of life, globally.",
    "The vision is to be a citadel of learning for holistic human transformation and development, anchored on the tripartite wheels of Character, Competence and Courage — expressed through an Outcome-Based Education approach driven by diligent, competent staff in a serene environment.",
  ],
};

export const researchResources = {
  title: "Research With Us",
  intro:
    "We are committed to building a regional and institutional database for advancing research in atmospheric and space science and associated technological innovations — towards significant contribution to sustainable development in Nigeria, Africa and the world over. We welcome viable collaborations that create mutual impact; contact us to explore partnership.",
  items: [
    {
      title: "VLF Receivers",
      description:
        "Very Low Frequency receivers for terrestrial atmospheric data collection.",
    },
    {
      title: "Magnetometer",
      description:
        "Ground-based measurements of Earth's magnetic field for geomagnetic and space weather research.",
    },
    {
      title: "Weather Station",
      description:
        "Captures rainfall, temperature, humidity, wind speed, wind direction, sun intensity and more.",
    },
    {
      title: "Network",
      description:
        "Connected to international space stations, collating satellite information from India, Germany, the United Kingdom, the USA and more.",
    },
    {
      title: "Research Team",
      description:
        "Hosting researchers from across the globe, with work published in international journals. Join us.",
    },
  ],
};

export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
};

export const team: TeamMember[] = [
  {
    name: "Dr. V.U.J. Nwankwo",
    role: "Lead Scientist, Centre for Space Research, AUL",
    photo: "/images/team/Nwankwo.png",
  },
  {
    name: "Dr. Victor Edward",
    role: "Resident Lead Scientist and Coordinator, CESPAR",
    photo: "/images/team/Edward.png",
  },
  {
    name: "Mr. Muyiwa Ajakaiye",
    role: "Atmospheric Physics/Meteorology, Physics",
    photo: "/images/team/ajakaiye.png",
  },
  {
    name: "Late Mr. Paul I. Anekwe",
    role: "Developer/AI and Remote Sensing, Mathematical Science",
    photo: "/images/team/Anekwe.png",
  },
  {
    name: "Dr. M. A. Olatunji",
    role: "Radiation and Nuclear Physics, Anchor University Lagos",
    photo: "/images/team/olatunji.png",
  },
  {
    name: "Mr. Timothy Akinsola",
    role: "Chief Technical Engineer, Physics",
    photo: "/images/team/Akinsola.png",
  },
  // {
  //   name: "Mr. Joel Ajamu",
  //   role: "Technical/Engineer, Mathematical Science",
  // },
  // {
  //   name: "Mr. Muyiwa Adeyanju",
  //   role: "Geophysics/Data Management",
  // },
  // {
  //   name: "Mr. Ademoh Adams",
  //   role: "Technical Support, ICT",
  // },
  {
    name: "Mr. Ndifreke Ebong",
    role: "Web Development/Engineer, Physics",
    photo: "/images/team/Ebong.png",
  },
  {
    name: "Mr. Tolulope Ahmed",
    role: "Webapp Developer, Media Coordinator,Physics",
    photo: "/images/team/tolulope.png",
  },
  {
    name: "Dr. Babatunde J. Falaye",
    role: "Supporting Scientist, CESPAR",
    photo: "/images/team/Falaye.png",
  },
  {
    name: "Dr. Jimoh Oluwaseyi",
    role: "Supporting Scientist, CESPAR",
    photo: "/images/team/jimoh.jpeg",
  },
  {
    name: "Mr. Blessing Aberegidi",
    role: "Supporting Scientist, CESPAR",
    photo: "/images/team/Blessing.png",
  },
];

export type Testimonial = {
  heading: string;
  quote: string;
  name: string;
  role: string;
  photo?: string;
};

export const testimonials: Testimonial[] = [
  {
    heading: "Very Active to Make a Mark on the Globe",
    quote: "CESPAR is active, focused, and already leaving its mark globally.",
    name: "Prof. J. A. Afolayan",
    role: "Pioneer Vice Chancellor, Anchor University Lagos",
    photo: "/images/testimonials/afolayan.jpg",
  },
  {
    heading: "Comparable Global Standard",
    quote: "CESPAR matches the best labs of its kind in the world.",
    name: "Prof. S. O. Bandele",
    role: "Vice Chancellor, Anchor University Lagos",
    photo: "/images/testimonials/bandele.jpg",
  },
  {
    heading: "A World-Class Research Center of Excellence",
    quote: "The facilities are superb and the staff are well-trained.",
    name: "Prof. J. O. Fatokun",
    role: "Deputy Vice Chancellor, Anchor University Lagos",
    photo: "/images/testimonials/fatokun_dvc.jpg",
  },
  {
    heading: "A Center of Attraction to Anchor University Lagos",
    quote: "A serene, fully-equipped lab of true international standard.",
    name: "Pastor M. O. Salami",
    role: "Registrar, Anchor University Lagos",
    photo: "/images/testimonials/salami.jpg",
  },
  {
    heading: "From Ayobo, Lagos to the World!",
    quote:
      "The faculty is rich in facilities — any science student here is lucky.",
    name: "Prof. K. V. F. Fatokun",
    role: "Dean, Faculty of Science and Science Education, AUL",
    photo: "/images/testimonials/fatokun_kvf.jpg",
  },
  {
    heading: "So, This Is Where We Get These Predictions?",
    quote: "This is where weather predictions are made, firsthand.",
    name: "Prof. Adeyanju",
    role: "Dean, Faculty of Humanities, Anchor University Lagos",
    photo: "/images/testimonials/adeyanju.jpg",
  },
  {
    heading: "A Window to a Great Career and Brighter Future",
    quote: "Working with this lab sets students up for a great career.",
    name: "Prof. Oyero",
    role: "Dean, Faculty of Social and Management Sciences, AUL",
    photo: "/images/testimonials/oyero.jpg",
  },
  {
    heading: "Where the Abstract Becomes Real",
    quote:
      "No other Nigerian university presents physics quite this way — live.",
    name: "Prof. B. A. Ezekoye",
    role: "Condensed Matter Physics, Anchor University Lagos",
    photo: "/images/testimonials/ezekoye.jpg",
  },
  {
    heading: "Bringing Physics to Reality",
    quote: "This lab turns abstract physics into real, local data.",
    name: "Prof. B. A. Arogundade",
    role: "Computer Science, Anchor University Lagos",
    photo: "/images/testimonials/arogundade.jpg",
  },
  {
    heading: "The Best Place to Study Physics in Nigeria!",
    quote: "Simply the best place to study Physics in Nigeria.",
    name: "Dr. J. A. Bamikole",
    role: "Radiation and Nuclear Physics, Anchor University Lagos",
    photo: "/images/testimonials/bamikole.jpg",
  },
  {
    heading: "Not Found Anywhere in Nigeria",
    quote: "It connects to more global labs than anywhere else in Nigeria.",
    name: "Dr. R. T. Akinnubi",
    role: "Atmospheric Physics, Anchor University Lagos",
    photo: "/images/testimonials/akinnubi.jpg",
  },
  {
    heading: "Where the Abstract Becomes Real",
    quote: "The lecturers make difficult physics simple for the students.",
    name: "Dr. O. E. Obisesan",
    role: "Atmospheric Physics, Anchor University Lagos",
    photo: "/images/testimonials/obisesan.jpg",
  },
  {
    heading: "A Reference Point for Excellence in Physics",
    quote: "The best place for hands-on space physics research.",
    name: "Mr. Muyiwa Ajakaiye",
    role: "Atmospheric Physics, Anchor University Lagos",
    photo: "/images/team/ajakaiye.png",
  },
  {
    heading: "This Lab's Impact Is Enormous on All and Sundry",
    quote:
      "This lab helps researchers understand and tackle atmospheric problems.",
    name: "Dr. M. A. Olatunji",
    role: "Radiation and Nuclear Physics, Anchor University Lagos",
    photo: "/images/team/olatunji.png",
  },
  {
    heading: "A Reference Point for Excellence in Physics",
    quote:
      "Researchers study solar flares and weather with the lab's own live data.",
    name: "Miss O. V. Fatoye",
    role: "Geophysics, Anchor University Lagos",
    photo: "/images/testimonials/fatoye.jpg",
  },
  {
    heading: "Positioned to Fill the Space Science Gap in Africa",
    quote:
      "CESPAR is closing Africa's space science gap, one dataset at a time.",
    name: "Dr. V. U. J. Nwankwo",
    role: "Lead Scientist, CESPAR & HOD Physics, AUL",
    photo: "/images/team/Nwankwo.png",
  },
];

export type Publication = {
  authors: string;
  title: string;
  citation: string;
};

export const publications: Publication[] = [
  {
    authors:
      "Nwankwo V.U.J., Denig W., Chakrabarti S.K., Ajakaiye M.P., Fatokun J., Akanni A.W., Raulin J-P., Correia E. and Enoh J.E. (2021)",
    title:
      "Atmospheric drag effects on modelled low Earth orbit (LEO) satellites during the July 2000 Bastille Day event in contrast to an interval of geomagnetically quiet conditions",
    citation: "Ann. Geophys., 39, 397-412, 2021",
  },
  {
    authors:
      "Ogunmodimu O., Honary F., Rogers N., Richardson I.G. and Nwankwo V.U.J. (2020)",
    title:
      "Empirical modelling of auroral absorption during disturbed periods of interplanetary coronal mass ejection events",
    citation:
      "J. Atmos. Solar-Terres. Phys., 207, 105364, doi:10.1016/j.jastp.2020.105364",
  },
  {
    authors:
      "Nwankwo V.U.J., Chakrabarti S.K., Sasmal S., Denig W., Ajakaiye M.P., Akinsola T., Adeyanju M., Anekwe P., Iluore K., Olatunji M., Bhowmick D., Fatokun J., Ayoola M.A., Soneye O.O. and Ajamu J. (2020)",
    title:
      "Radio aeronomy in Nigeria: First results from very low frequency (VLF) radio waves receiving station at Anchor University, Lagos",
    citation:
      "2020 IEEE-ICMCECS, Lagos, Nigeria, pp 1-7, DOI:10.1109/ICMCECS47690.2020.247002",
  },
  {
    authors:
      "Nwankwo V.U.J., Denig W., Ajakaiye M.P., Akanni W., Fatokun J., Raulin J-P., Correia E. and Enoh J.E. (2020)",
    title:
      "Simulation of atmospheric drag effect on low Earth orbit satellites during intervals of perturbed and quiet geomagnetic conditions in the magnetosphere-ionosphere system",
    citation:
      "2020 IEEE-ICMCECS, Lagos, Nigeria, pp 1-7, DOI:10.1109/ICMCECS47690.2020.247003",
  },
];

export type ResearchContributor = {
  name: string;
  /** Omitted for external/non-team co-authors — falls back to an initials avatar. */
  photo?: string;
};

export type CompletedResearch = {
  title: string;
  authors: string;
  citation: string;
  /** Feature image pulled from the publication itself. Falls back to a plain icon tile when absent. */
  thumbnail?: string;
  /** Ordered lead-first — drives the circular avatar stack. */
  contributors: ResearchContributor[];
  featured?: boolean;
};

/** Strips a trailing "(YYYY)" and splits an author-list string into individual names. */
function parseAuthorNames(authors: string): string[] {
  return authors
    .replace(/\s*\(\d{4}\)\s*$/, "")
    .split(/,\s*|\s+and\s+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

/** Matches an author-list name (e.g. "Nwankwo V.U.J.") to a team photo by surname. */
function findTeamPhoto(authorName: string): string | undefined {
  const surname = authorName.split(/\s+/)[0]?.toLowerCase();
  if (!surname) return undefined;
  return team.find(
    (member) => member.name.split(/\s+/).pop()?.toLowerCase() === surname
  )?.photo;
}

function contributorsFromAuthors(authors: string): ResearchContributor[] {
  return parseAuthorNames(authors).map((name) => ({
    name,
    photo: findTeamPhoto(name),
  }));
}

// Peer-reviewed papers and dissertations produced using CESPAR's facilities
// and data — shown on the homepage "Completed Research" section and in full
// on /research/completed. The first entry is the homepage feature.
export const completedResearch: CompletedResearch[] = [
  {
    title:
      "Space weather forecasting using VLF data as an indicator for ionospheric disturbance to improve space weather forecasting in Nigeria",
    authors: "Ahmed T.S., Odeyemi O.O., Nwankwo V.U.J. (2025)",
    citation:
      "Anchor University Journal of Science and Technology (AUJST), Vol. 1 No. 1, pp. 1-6, 2025",
    thumbnail: "/images/research/vlf-space-weather-figure.jpg",
    contributors: [
      { name: "Mr. Tolulope Ahmed", photo: "/images/team/tolulope.png" },
      { name: "O. O. Odeyemi" },
      { name: "Dr. V.U.J. Nwankwo", photo: "/images/team/Nwankwo.png" },
    ],
    featured: true,
  },
  ...publications.map((pub) => ({
    title: pub.title,
    authors: pub.authors,
    citation: pub.citation,
    contributors: contributorsFromAuthors(pub.authors),
  })),
];

export const footerQuickLinks = [
  { label: "About CESPAR", href: "/about#cespar" },
  { label: "About AUL", href: "/about#aul" },
  { label: "Publications", href: "/publications" },
  { label: "Bulletins", href: "/bulletins" },
  { label: "Our Team", href: "/team" },
  { label: "Request Data", href: "/request-data" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
];

// Bank transfer is a placeholder route while CESPAR sets up an official
// institutional account (and decides whether to add Paystack for
// card/USSD donations later) — swap these details in once that lands.
export const donationInfo = {
  intro:
    "CESPAR relies on donor support to maintain our ground stations, fund student research training and expand open access to space-weather data across Nigeria.",
  note: "Please use your name or organisation as the payment reference so we can confirm and acknowledge your donation.",
  bankTransfer: {
    accountName: "Tolulope Ahmed",
    bankName: "Guaranty Trust Bank (GTBank)",
    accountNumber: "0037181980",
  },
  // Icon keys map to lucide-react components in ImpactList.tsx.
  impact: [
    {
      icon: "radio",
      title: "Ground station upkeep",
      description:
        "Keeps our VLF, weather and radio-wave sensors running so the sky above Nigeria stays monitored, all day.",
    },
    {
      icon: "graduation",
      title: "Student research training",
      description:
        "Funds the mentorship and lab time behind dissertations like the ones now published in peer-reviewed journals.",
    },
    {
      icon: "globe",
      title: "Open data access",
      description:
        "Keeps our dataset catalogue free and open to researchers, students and schools across Nigeria and Africa.",
    },
    {
      icon: "award",
      title: "Conferences & publications",
      description:
        "Gets CESPAR research in front of the world — from COSPAR to the European Space Weather Week.",
    },
    {
      icon: "rocket",
      title: "Growing space science in Africa",
      description:
        "Helps build the regional database and collaborations this field needs to grow across the continent.",
    },
  ],
};
