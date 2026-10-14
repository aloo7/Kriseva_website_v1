// faq.ts: questions buyers and suppliers actually ask. Used on the home page
// (first eight) and /resources (all), and emitted as FAQPage JSON-LD.
// Every answer stays inside 00_BRAIN/FACTS.md wording.

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: 'What does Kriseva do?',
    a: 'Kriseva builds software for defence and space procurement in India. TAS helps suppliers find, read and answer government tenders. Evaluator helps government evaluation committees check every bid, with the source page behind every finding. Both run on your premises.',
  },
  {
    q: 'Does Evaluator decide which bid wins?',
    a: 'No. Evaluator proposes findings with evidence, and each one links to the page it came from. The committee reviews them, and a named officer makes and records the decision.',
  },
  {
    q: 'Does our data leave our premises?',
    a: 'It does not have to. Both products run on your own machines with local models. In a test on 6 October 2026, Evaluator cold-started with the Wi-Fi off and zero application requests left the machine. TAS goes online only to read public procurement portals, and only when you let it.',
  },
  {
    q: 'Which tender portals does TAS read?',
    a: 'On 13 October 2026, TAS was reading 27 public sources, including GeM, CPPP, ISRO e-Procurement, NSIL, IN-SPACe, Defence eProcurement, eTenders and state NIC portals, and held 84,141 distinct open tenders.',
  },
  {
    q: 'Is Kriseva approved or used by a government body?',
    a: 'No government body endorses Kriseva, and we do not name institutions on this site. We have demonstrated Evaluator to government procurement stakeholders, and we hold two signed, non-binding letters of intent from defence MSMEs to evaluate TAS in a pilot. The Proof page lists every claim exactly as it stands.',
  },
  {
    q: 'How does a pilot work?',
    a: 'For suppliers, we set TAS up on your machine, load your capability list and run it on live tenders with your bid team. For buyers, we run Evaluator on a closed tender your committee has already decided, so every finding can be checked against a known result.',
  },
  {
    q: 'What does it cost?',
    a: 'We quote per engagement after a pilot, based on the modules, deployment and team size you need. Build a request on the Plans page and the founder replies directly.',
  },
  {
    q: 'Who is behind Kriseva?',
    a: 'Kriseva AI Private Limited was incorporated in Hyderabad on 7 May 2026. Ayush Tiwary is Founder and CEO, and Anubhav Lal Dass is Co-founder and COO (joining full time on funding). We are pre-revenue and bootstrapped, and were selected in the Top 15 of the GIFT IFIH Young Builders’ Program Hackathon 2026.',
  },
  {
    q: 'What kind of AI does Kriseva use?',
    a: 'Open models that run locally on your hardware, together with deterministic rules. Every output links to its source, so a person can check it before anything is decided.',
  },
  {
    q: 'Can TAS submit bids for us?',
    a: 'No. TAS prepares: it finds tenders, reads them, and builds the checklist and document pack. Your team reviews and submits on the portal.',
  },
];
