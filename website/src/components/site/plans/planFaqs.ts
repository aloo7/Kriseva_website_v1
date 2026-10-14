// planFaqs.ts: the four plan questions for /plans, also emitted as FAQPage
// JSON-LD. Wording stays inside FACTS: no figures, no customers, no free offer.
import type { Faq } from '../../../data/faq';

export const planFaqs: Faq[] = [
  {
    q: 'How much does a plan cost?',
    a: 'We quote per engagement, after a pilot, for the modules, deployment and team size you choose. There is no rate card on this page. Kriseva is pre-revenue and bootstrapped, so each quote is written by the founder for the work in front of him.',
  },
  {
    q: 'What does a pilot involve?',
    a: 'For suppliers, we set TAS up on your machine, load your capability list and run it on live tenders with your bid team. For buyers, we run Evaluator on one closed tender your committee has already decided, so every finding can be checked against a known result. The scope is set out in a pilot plan before anything is installed.',
  },
  {
    q: 'Where does it run, and what do the deployment options mean?',
    a: 'Both products run on your own machines with local models. Choose offline if the install should stay closed to the network. Choose connected if TAS should read public procurement portals: the tender radar needs that. TAS goes online to read those portals, when you allow it, and for nothing else. Evaluator does not need a connection. If you are unsure, choose Let us advise and we will talk it through.',
  },
  {
    q: 'What happens after I send a request?',
    a: 'The founder reads it and replies within two working days. Then comes a 30-minute call about your tenders and your side of the table, and then a written pilot plan. Nothing leaves the plan builder until you press send yourself.',
  },
];
