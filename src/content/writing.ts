/*
 * Essays on /writing. Each one starts as Jason talking an idea through out loud; the transcript is then edited into
 * shape. Rules, same as the rest of the site: only stories that happened, only results that are on a project page,
 * and `draft: true` until Jason has read every line. Drafts show a "Draft" label and stay out of the sitemap.
 */
export type Block =
  | string
  | { h: string }
  | { quote: string; cite: string };

export type Post = {
  slug: string;
  title: string;
  // One sentence under the title, in the italic voice.
  dek: string;
  // Month the piece was written, as the visitor reads it.
  when: string;
  draft: boolean;
  themes: string[];
  body: Block[];
  // Pages on this site the essay leans on.
  related?: { href: string; label: string }[];
};

export const posts: Post[] = [
  {
    slug: "testing-whats-true",
    title: "Testing what's true",
    dek: "Observation gives you clues. It never gives you proof.",
    when: "November 2026",
    draft: true,
    themes: ["Rigor", "Philosophy of science"],
    body: [
      "My first class as a graduate student was called Theory of Predictive Modeling. It didn't open with a model. It opened with a problem in philosophy: the problem of induction. Not the proof technique from mathematics. The older question of whether you can work out the rules of the world by watching it. The textbook was David Deutsch's The Beginning of Infinity, which argues for science, and for doing it well.",
      "The answer the class argued for, and the one I have come to believe, is that you can't. You do not generalise structure from observations. However many times you see something happen, the pile of observations does not turn into a law.",
      { h: "Conjecture first" },
      "What you can do is guess. You make a conjecture about the structure of the thing, and then you design an experiment that could show the conjecture is wrong. Observation still matters. It gives you clues about what the structure might be, and it helps you imagine what might be possible. But it does not confirm anything.",
      "A controlled experiment doesn't confirm anything either. It can disprove your conjecture, or it can come out in its favour. Coming out in its favour is not the same as proof.",
      {
        quote: "The criterion of the scientific status of a theory is its falsifiability, or refutability, or testability.",
        cite: "Karl Popper, Conjectures and Refutations (1963)",
      },
      "The class had two halves that turned out to be one question. From the side of science: when can we know something and be sure of it? From the technical side: when can we be sure about a model, and how do we know it has captured something about the world and not only something about our data?",
      { h: "What it changed in my work" },
      "It changed the order I do things in. On my internship I compared two ways for a coding agent to clarify requirements before it writes code. I wrote the analysis down before any runs, and every run was scored blind against a hidden test suite. I expected the more structured method to produce more correct code. It didn't. Correctness came out the same.",
      "It also changed how I read my own results. I took a class project that predicted TikTok views and set out to improve its model. Before improving it I tried to break it, and found three data leaks that explained the original result. With them fixed, the median of a creator's last ten posts beat the model.",
      "And it changed what I count as evidence. When I demoed senti, people would pick a calm emotion and get a song with mellow lyrics and an upbeat sound. I could see why the model put the song there. It still wasn't true to how people hear music. That feeling was a conjecture, so I tested it with listeners, and the listeners agreed with the feeling and not with the model.",
      "I would rather know what's true than be right. Most of the time the way to find out is to make a guess you could lose.",
    ],
    related: [
      { href: "/projects/coding-agent-harness", label: "Coding-agent harness" },
      { href: "/projects/tiktok-conformal", label: "TikTok forecasting" },
      { href: "/projects/senti", label: "senti" },
    ],
  },
  {
    slug: "a-simpler-model",
    title: "A simpler model that holds more truth",
    dek: "Three times I learned that understanding more can mean carrying less.",
    when: "November 2026",
    draft: true,
    themes: ["Creativity", "Ballroom", "Modeling"],
    body: [
      "When I start learning something, I collect rules. A rule for this step, a rule for that chord, a rule for this kind of problem. Later, if I stay with it long enough, the rules collapse. A handful of more abstract ones turn out to govern everything the long list did, and more. I end up knowing more and carrying less.",
      { h: "Sway is a consequence" },
      "My ballroom coach, Andres End, said something to our top technique class at BYU that stuck with me. He told us he believes we think about dancing a step in an entirely different way than he does. Our strategy, he said, is to try to sway. We work at the sway, and we never actually get around our partners in the rotation.",
      "He doesn't think about sway. He thinks about moving past his partner. Sway is what happens when you do that. It is a consequence of the movement, not the cause of it.",
      "I talked with him about it at a lesson that evening. Part of what I took away was about dancing. The other part was about trust. His understanding of what matters in a step is far ahead of mine, and I don't have to resolve every detail that doesn't fit my own model before I act on his. Sometimes the detail doesn't fit because my model is the one that's wrong.",
      { h: "Simpler is not lesser" },
      "The third time was in a classroom. In Theory of Predictive Modeling we talked about why a simpler model or abstraction is not a lesser one. Every later refinement inherits the truth the earlier model captured. And a simple statement can leave room for a great deal of nuance that its formula never spells out. There is real beauty in that.",
      "Put the three together and you get a picture of expertise I find convincing. A master's model of the thing is simpler than a novice's, and it has captured more truth. The novice is reasoning about a dozen visible features. The master has found the one thing that produces them.",
      { h: "The same thing in machine learning" },
      "Andres's class was working on what you can see, and he was working on what causes it. Machine learning has the same trap. It is easy to optimise the visible measure and miss the thing it was standing in for.",
      "I saw a small version of this in my ballroom style finder. Hand-built rhythm features and tempo rules each got part of the way. A small probe on a frozen music model beat all of them, and the signal sat in the model's middle layers, not at the top. The better representation was the simpler thing to build on.",
      "This idea has limits and I don't want to oversell it. A refinement inherits the earlier truth when the simpler model sits inside it, which is not every case. And simple models can simply be wrong. What I believe is narrower: when a simple model keeps working in situations it wasn't built for, it has probably found something real.",
    ],
    related: [{ href: "/projects/ballroom", label: "Ballroom style finder" }],
  },
  {
    slug: "making-things-up",
    title: "Better at making things up",
    dek: "Knowledge is understanding the facts. Wisdom is understanding the structure.",
    when: "November 2026",
    draft: true,
    themes: ["Creativity", "Judgment", "Music"],
    body: [
      "In a lesson this week my coach, Andres End, and I were trying to fix something in a step, and we ended up changing it instead. It worked. He said that sometimes you just have to make stuff up.",
      "He told me about one of his top students, half of one of the best young couples in the country. He had taught her something and she stopped and asked, \"Did you just make that up?\" He said, \"Yep.\"",
      "I told him that, to be fair, he is a lot better at making things up than I am.",
      { h: "What that means" },
      "It means he has a much more refined and accurate model of how ballroom dancing works than I do. So when he meets a situation he hasn't seen, his guesses work more often than mine. And mine work more often than they did when I was new. I am better now at telling which things are possible, and which of the possible things will produce the result I want.",
      "I think that is what we mean by good judgment. Knowledge is understanding the facts. Wisdom is understanding the structure: the causal rules that say how a system works and how its parts interact.",
      "Judgment is trained. Understanding the structure is not enough, and neither is guessing a lot. I try something in practice and it works or it doesn't, and over years that record of what worked sharpens the next guess. It is also separate from raw skill. Someone can be enormously talented and unable to say why anything they do works. The two go together often, but not always.",
      { h: "Composing with a map" },
      "When I write or arrange music, I usually start with something I want that I can't put into words. A feeling, or a kind of sound. You lose most of it if you try to describe it. The music is the only faithful version.",
      "What gets me there is structure. I know how tension and release work in harmony. I know that how consonant two tones sound has to do with the ratio of their frequencies, and how intervals behave in different contexts. So I don't wander around hoping to bump into the thing. I have a sense of which directions are worth searching, and whether what I want is even reachable from what the piece has already done.",
      "That is how I think about creativity. Something new that is also good almost never comes from ignoring the rules of a system. It comes from understanding them well enough to see what they permit that nobody has tried.",
      { h: "In teaching, and in search" },
      "The same thing made me a better teacher. When students couldn't see why multiplying by a negative number flips the sign, and why doing it twice flips it back, I used Uno reverse cards. One reverse changes the direction of play. A second one changes it back. The structure is the same, and they already owned one copy of it.",
      "It is also why I'm drawn to search problems. My project on Pokémon team building uses a quality-diversity search, which is built to return many strong answers that differ from each other instead of one winner. A search like that is only as good as its sense of which directions are worth exploring. I recognise the problem. It is the one I have at the piano.",
    ],
    related: [
      { href: "/projects/vgc-team-generation", label: "VGC team generation" },
      { href: "/beyond#music", label: "Music" },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

// Shown under every essay. The process is part of the record.
export const processNote =
  "I talked this through out loud and edited the transcript with help from Claude. The ideas, the stories and any mistakes are mine.";
