/*
 * Milestones for the life timeline on /about. PLACEHOLDERS: the six from Jason's first message plus two that are
 * already on the site. `when` is printed only where it is known; `figureAge` only sets how grown the figure
 * looks at that point and is never shown. Replace with the full list when it arrives; order is the timeline order.
 */
export type Milestone = { title: string; when?: string; note: string; figureAge: number };

export const milestones: Milestone[] = [
  { title: "Born", note: "Every timeline starts somewhere.", figureAge: 0 },
  { title: "First soccer team", when: "Age 4", note: "Started playing soccer at four.", figureAge: 4 },
  { title: "Joined choir", note: "Where singing with other people started.", figureAge: 10 },
  { title: "Piano auditions", note: "Years of practice, a few minutes on stage.", figureAge: 14 },
  { title: "Lead in the musical", when: "High school", note: "Played the lead in my high school musical.", figureAge: 16.5 },
  { title: "Captain on senior night", when: "Senior year", note: "Chosen to captain the varsity soccer team on senior night.", figureAge: 17.5 },
  { title: "Mission", note: "Served a mission.", figureAge: 19 },
  { title: "Started teaching", when: "2020", note: "Began teaching math and programming at Juni Learning.", figureAge: 21 },
  { title: "Graduate school", when: "Now", note: "MS in Computer Science at BYU, finishing December 2027.", figureAge: 25 },
];
