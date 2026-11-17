/*
 * Milestones for the life timeline on /about, curated from Jason's own list (Nov 2026). Order is timeline order.
 * `year` is a decimal year; it is used only to work out how grown the figure looks (born April 2001).
 * `when` is what the visitor reads. `prop` picks the scene the figure acts out there.
 */
export type Prop =
  | "cradle" | "ball" | "controller" | "keys" | "book" | "cube" | "note" | "cards" | "badge" | "stage"
  | "cap" | "globe" | "chalk" | "run" | "house" | "dance" | "briefcase" | "trophy" | "laptop" | "flag"
  | "kick" | "recital" | "math" | "arrange" | "fly";

export type Milestone = { title: string; when: string; note: string; year: number; prop: Prop };

export const milestones: Milestone[] = [
  { title: "Born in Utah", when: "2001", year: 2001.3, prop: "cradle", note: "April 2001." },
  { title: "First soccer team", when: "2005 · Age 4", year: 2005.6, prop: "ball", note: "My mom was the coach." },
  { title: "Alaska", when: "2006", year: 2006.5, prop: "controller", note: "I saw my grandparents every weekend, and my uncle introduced me to Pokémon and Zelda." },
  { title: "A first piano teacher", when: "2009 · Age 8", year: 2009.7, prop: "keys", note: "We moved to North Carolina. I took piano lessons for a few months before my teacher moved away, and that was enough to start an interest in music." },
  { title: "Battle of the Books", when: "2010 · 4th grade", year: 2010.8, prop: "book", note: "I joined the team in fourth grade, read everything I could find, and won the school spelling bee the next year." },
  { title: "Team captain, and a cube", when: "2015 · 8th grade", year: 2015.2, prop: "cube", note: "I captained our Battle of the Books team to first place in our area and third at regionals, played on the school soccer team, and learned to solve a Rubik's cube." },
  { title: "Joined choir", when: "2015 · 9th grade", year: 2015.8, prop: "note", note: "I joined choir, started teaching myself piano, and went to all-state choir that year and every year of high school." },
  { title: "Real piano lessons", when: "March 2017 · Age 15", year: 2017.2, prop: "keys", note: "I started lessons just before I turned 16." },
  { title: "Captain on senior night", when: "Fall 2018", year: 2018.8, prop: "kick", note: "I captained the varsity soccer team on senior night." },
  { title: "Piano auditions", when: "December 2018", year: 2018.95, prop: "recital", note: "Less than two years after my first lesson, I auditioned for piano programs with Beethoven's Tempest sonata, a Bach prelude and fugue, and Rachmaninoff's Prelude in C-sharp minor." },
  { title: "Lead in Footloose", when: "May 2019", year: 2019.4, prop: "stage", note: "I played the lead in my school's musical." },
  { title: "High school graduation", when: "June 2019", year: 2019.45, prop: "cap", note: "I earned my Eagle Scout that April, and graduated with my IB diploma and the joint top score in the program's history at my school." },
  { title: "Piura, Peru", when: "October 2019", year: 2019.8, prop: "globe", note: "I began missionary service in Piura. Illness cut it short that December." },
  { title: "BYU", when: "March 2020", year: 2020.2, prop: "math", note: "I moved to BYU and started as a physics major, still in love with piano, and switched to mathematics a year later. I began teaching math at Juni Learning, and later computer science." },
  { title: "Voice lessons", when: "September 2020", year: 2020.7, prop: "note", note: "Something I had wanted to do for a long time." },
  { title: "Russian house, a cappella", when: "2021", year: 2021.6, prop: "house", note: "I moved into a Russian-only apartment in BYU's foreign language housing, sang in Men's Chorus, and joined an a cappella group. We made two music videos, and I arranged the music for one." },
  { title: "First ballroom class", when: "Fall 2022", year: 2022.8, prop: "dance", note: "I took my first ballroom dance class. A few months later I became an organist at the Provo temple, which I did for two years." },
  { title: "Bain and Deloitte", when: "Summer 2023", year: 2023.5, prop: "fly", note: "Internships at Bain in Dallas and Deloitte in Washington, DC taught me I didn't want to do consulting. My project at Bain made me think seriously about working in education." },
  { title: "Won my first ballroom competition", when: "Fall 2024", year: 2024.7, prop: "trophy", note: "I started competing in fall 2023, passed my Licentiate exam in International Latin in August 2024, and won my first competition that fall. I also began arranging music for ballroom, and world professional Smooth finalists performed one of my pieces at Blackpool in May 2025." },
  { title: "BS in Mathematics", when: "April 2025", year: 2025.3, prop: "cap", note: "Graduated with minors in Music and Ballroom Dance, a month after being accepted to BYU's master's program in computer science." },
  { title: "Master's", when: "Fall 2025", year: 2025.7, prop: "laptop", note: "I started the MS in Computer Science and made the BYU Ballroom Dance Showcase company." },
  { title: "Now", when: "2026", year: 2026.9, prop: "flag", note: "Dancing, studying, working as a data science intern, and building and learning with AI as fast as I can." },
];

export const BIRTH_YEAR = 2001.3;

/* A greeting in each language, shown as a speech bubble around the year Jason started learning it (Russian sits on the Russian house stop). */
export const greetings = [
  { language: "Spanish", hello: "¡Hola!", year: 2016.5 },
  { language: "German", hello: "Hallo!", year: 2018.0 },
  { language: "Russian", hello: "Привет!", year: 2021.6 },
  { language: "Italian", hello: "Ciao!", year: 2020.45 },
];
