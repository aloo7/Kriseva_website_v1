// glossary.ts: the defence and space procurement glossary shown on /resources
// and emitted as DefinedTermSet JSON-LD. Definitions are neutral and general.
// Where rules differ by organisation, the entry says so. Defining a public
// body or portal here implies no relationship with Kriseva.

export type GlossCategory =
  | 'Portals'
  | 'Bodies and policy'
  | 'Tenders and documents'
  | 'Evaluation'
  | 'Money and preferences'
  | 'Kriseva terms';

export interface GlossTerm {
  id: string;
  term: string;
  /** Long form, when the term is an abbreviation. */
  full?: string;
  category: GlossCategory;
  /** One or two sentences. */
  def: string;
  /** Other names people search for. */
  aka?: string[];
  /** Ids of related terms. */
  see?: string[];
}

export const categories: GlossCategory[] = [
  'Portals',
  'Bodies and policy',
  'Tenders and documents',
  'Evaluation',
  'Money and preferences',
  'Kriseva terms',
];

const raw: GlossTerm[] = [
  {
    id: 'gem',
    term: 'GeM',
    full: 'Government e-Marketplace',
    category: 'Portals',
    def: 'An online platform on which central and state government buyers purchase goods and services through catalogues, bids and reverse auctions. Its rules and terms of use are set by the platform and change from time to time, so check the current version.',
    aka: ['Government e-Marketplace', 'GeM portal'],
    see: ['reverse-auction', 'mse-exemption', 'make-in-india'],
  },
  {
    id: 'cppp',
    term: 'CPPP',
    full: 'Central Public Procurement Portal',
    category: 'Portals',
    def: 'A national portal where many central government organisations publish tenders, corrigenda and award details. Organisations often run their own eProcurement portals alongside it.',
    aka: ['Central Public Procurement Portal', 'eprocure'],
    see: ['gepnic', 'tender', 'corrigendum'],
  },
  {
    id: 'gepnic',
    term: 'NIC eProcurement (GePNIC)',
    full: 'Government eProcurement System of NIC',
    category: 'Portals',
    def: 'Tender-management software from the National Informatics Centre, used by many central and state organisations to publish tenders and receive bids online. Each organisation runs its own instance, with its own address, registration and sometimes its own rules.',
    aka: ['GePNIC', 'NIC portal', 'state eProcurement', 'eTenders'],
    see: ['cppp', 'tender'],
  },
  {
    id: 'defence-eprocurement',
    term: 'Defence eProcurement portal',
    category: 'Portals',
    def: 'The online portal where defence buyers publish tenders and receive bids. Bidders generally need to register, and some tender documents are visible after login.',
    aka: ['DefProc', 'defproc', 'defence procurement portal'],
    see: ['tender', 'dap'],
  },
  {
    id: 'dap',
    term: 'DAP',
    full: 'Defence Acquisition Procedure',
    category: 'Bodies and policy',
    def: 'The Government of India policy document that governs how the armed forces acquire capital equipment, including the categories of acquisition and the approval stages for each. It is revised from time to time, so read the edition in force.',
    aka: ['Defence Acquisition Procedure', 'DAP 2020'],
    see: ['defence-eprocurement', 'oem'],
  },
  {
    id: 'idex',
    term: 'iDEX',
    full: 'Innovations for Defence Excellence',
    category: 'Bodies and policy',
    def: 'A Government of India scheme that supports start-ups, MSMEs and innovators in developing technologies for defence needs through open challenges. It works through challenge calls and grants, which differ from an ordinary tender.',
    aka: ['Innovations for Defence Excellence', 'defence innovation'],
    see: ['tender'],
  },
  {
    id: 'in-space',
    term: 'IN-SPACe',
    full: 'Indian National Space Promotion and Authorization Centre',
    category: 'Bodies and policy',
    def: 'A Government of India body that promotes and authorises private-sector space activity. It publishes opportunities and facility-sharing information for space companies.',
    aka: ['IN-SPACe', 'INSPACe', 'Indian National Space Promotion and Authorization Centre'],
    see: ['nsil'],
  },
  {
    id: 'nsil',
    term: 'NSIL',
    full: 'NewSpace India Limited',
    category: 'Bodies and policy',
    def: 'A central public sector enterprise in the space sector that markets space products and services commercially. It publishes its own tenders.',
    aka: ['NewSpace India Limited', 'NewSpace India'],
    see: ['in-space', 'tender'],
  },
  {
    id: 'tender',
    term: 'Tender',
    category: 'Tenders and documents',
    def: 'An invitation from a buyer to suppliers to submit offers for goods, works or services against stated specifications and conditions. In everyday use the word also covers the whole bundle of documents that comes with the invitation.',
    aka: ['NIT', 'notice inviting tender', 'tender bundle'],
    see: ['bid', 'rfp', 'rfq', 'corrigendum'],
  },
  {
    id: 'bid',
    term: 'Bid',
    category: 'Tenders and documents',
    def: 'A supplier’s offer in response to a tender: the price, the technical documents and the declarations the tender asks for. A bid that does not meet the stated conditions can be rejected.',
    aka: ['offer', 'quotation', 'proposal'],
    see: ['tender', 'two-bid-system', 'technical-evaluation-committee'],
  },
  {
    id: 'corrigendum',
    term: 'Corrigendum',
    full: 'plural: corrigenda',
    category: 'Tenders and documents',
    def: 'A notice that amends a published tender, for example by changing a date, a specification or an eligibility condition. Bidders are expected to read every corrigendum issued before the closing date.',
    aka: ['corrigenda', 'amendment', 'addendum'],
    see: ['tender', 'bid'],
  },
  {
    id: 'rfp',
    term: 'RFP',
    full: 'Request for proposal',
    category: 'Tenders and documents',
    def: 'A tender document used when the buyer describes a need and asks suppliers to propose how they would meet it, often for complex systems or services. Proposals are usually scored against stated criteria rather than on price alone.',
    aka: ['request for proposal'],
    see: ['rfq', 'qcbs', 'tender'],
  },
  {
    id: 'rfq',
    term: 'RFQ',
    full: 'Request for quotation',
    category: 'Tenders and documents',
    def: 'A simpler invitation for price quotes against a defined specification, used for routine or low-value purchases. When an organisation may use an RFQ depends on its own purchase manual.',
    aka: ['request for quotation', 'quotation'],
    see: ['rfp', 'limited-tender'],
  },
  {
    id: 'limited-tender',
    term: 'Limited tender',
    full: 'Limited tender enquiry (LTE)',
    category: 'Tenders and documents',
    def: 'A tender sent to a selected list of suppliers instead of being advertised openly. It is allowed in the cases and below the value limits that the buyer’s rules specify.',
    aka: ['LTE', 'limited tender enquiry', 'restricted tender'],
    see: ['single-tender', 'rfq'],
  },
  {
    id: 'single-tender',
    term: 'Single tender',
    full: 'Single tender enquiry (STE)',
    category: 'Tenders and documents',
    def: 'Procurement from one named source, permitted in the cases the rules list, such as a proprietary item or a genuine emergency. It usually needs a written justification and a competent approval.',
    aka: ['STE', 'single tender enquiry', 'nomination', 'proprietary article'],
    see: ['limited-tender'],
  },
  {
    id: 'two-bid-system',
    term: 'Two-bid system',
    full: 'Technical and financial bids',
    category: 'Tenders and documents',
    def: 'A format in which each bidder submits a technical bid and a financial bid separately. Technical bids are opened and evaluated before any financial bid is opened, and financial bids are opened for the bidders who qualify.',
    aka: ['two-envelope', 'two cover', 'technical bid', 'financial bid', 'price bid'],
    see: ['technical-evaluation-committee', 'l1', 'qcbs'],
  },
  {
    id: 'oem',
    term: 'OEM',
    full: 'Original equipment manufacturer',
    category: 'Tenders and documents',
    def: 'The company that makes a product and holds its design. Tenders often ask whether a bidder is the OEM or an authorised dealer, and may require an OEM authorisation letter.',
    aka: ['original equipment manufacturer', 'authorised dealer', 'OEM authorisation'],
    see: ['bid', 'make-in-india'],
  },
  {
    id: 'technical-evaluation-committee',
    term: 'Technical evaluation committee',
    full: 'TEC',
    category: 'Evaluation',
    def: 'A group of officers appointed by the buyer to check bids against the tender’s technical and eligibility conditions and to record which bidders qualify and why. Its composition and powers are set by the buyer’s own rules.',
    aka: ['TEC', 'tender evaluation committee', 'technical bid evaluation', 'bid evaluation'],
    see: ['comparative-statement', 'two-bid-system', 'audit-trail'],
  },
  {
    id: 'comparative-statement',
    term: 'Comparative statement',
    category: 'Evaluation',
    def: 'A table that sets bidders side by side against the tender’s criteria or prices, to show how each bid compares and why a bidder was accepted or rejected. It often becomes part of the record an auditor reads later.',
    aka: ['CS', 'comparison chart', 'evaluation matrix'],
    see: ['technical-evaluation-committee', 'l1', 'evidence-trail'],
  },
  {
    id: 'l1',
    term: 'L1',
    full: 'Lowest bidder',
    category: 'Evaluation',
    def: 'The bidder with the lowest price among those whose bids passed technical evaluation. L2 and L3 are the next lowest, and in some tenders they are asked to match the L1 price.',
    aka: ['lowest bidder', 'L2', 'L3', 'lowest price'],
    see: ['qcbs', 'two-bid-system'],
  },
  {
    id: 'qcbs',
    term: 'QCBS',
    full: 'Quality and cost based selection',
    category: 'Evaluation',
    def: 'A method that scores each bid on technical quality and on price, then combines the two scores using weights stated in the tender, so the highest combined score is selected rather than the lowest price. It is used for services and similar work where the rules allow it.',
    aka: ['quality and cost based selection', 'quality cum cost', 'weighted score'],
    see: ['l1', 'rfp'],
  },
  {
    id: 'reverse-auction',
    term: 'Reverse auction',
    category: 'Evaluation',
    def: 'An online auction in which qualified bidders lower their prices in turn, within a fixed time, against a start price. Some portals, including GeM, offer it for suitable items, and the tender says whether it applies.',
    aka: ['e-RA', 'eRA', 'online auction'],
    see: ['gem', 'l1'],
  },
  {
    id: 'emd',
    term: 'EMD',
    full: 'Earnest money deposit',
    category: 'Money and preferences',
    def: 'A sum a bidder deposits with its bid as a guarantee that it will honour the offer, usually set as a percentage of the estimated value and returned to unsuccessful bidders. Whether it is required, the amount and who is exempt differ by tender and by organisation.',
    aka: ['earnest money deposit', 'bid security', 'earnest money'],
    see: ['mse-exemption', 'pbg'],
  },
  {
    id: 'pbg',
    term: 'PBG',
    full: 'Performance bank guarantee',
    category: 'Money and preferences',
    def: 'A bank guarantee, usually given by the successful bidder after the award, that the buyer can claim against if the supplier fails to perform the contract. The amount, validity and form are set in the contract; some tenders call it performance security or ePBG.',
    aka: ['performance bank guarantee', 'ePBG', 'performance security'],
    see: ['emd'],
  },
  {
    id: 'mse-exemption',
    term: 'MSE exemption',
    category: 'Money and preferences',
    def: 'A benefit under the public procurement policy for micro and small enterprises that can include relief from tender fees and EMD, subject to the tender’s conditions. The exact benefits and the proof asked for, such as a Udyam registration, are stated in each tender.',
    aka: ['MSE', 'MSME', 'micro and small enterprises', 'Udyam', 'EMD exemption'],
    see: ['emd', 'make-in-india', 'gem'],
  },
  {
    id: 'make-in-india',
    term: 'Make in India (PPP-MII)',
    full: 'Public Procurement (Preference to Make in India)',
    category: 'Money and preferences',
    def: 'A government order that gives preference in procurement to goods, services and works with local content. Suppliers are classed by how much local content they offer, and each tender states the thresholds and the certificate it requires.',
    aka: ['PPP-MII', 'MII', 'local content', 'purchase preference', 'Make in India'],
    see: ['local-supplier-class', 'mse-exemption'],
  },
  {
    id: 'local-supplier-class',
    term: 'Class I and Class II local supplier',
    category: 'Money and preferences',
    def: 'The supplier classes used under the Make in India preference order. In the general order, Class I means at least 50 per cent local content and Class II means more than 20 per cent but less than 50 per cent; a sector or a tender can set different thresholds, so rely on the tender.',
    aka: ['Class I', 'Class II', 'class-I local supplier', 'class-II local supplier', 'non-local supplier', 'local content certificate'],
    see: ['make-in-india'],
  },
  {
    id: 'bid-or-skip',
    term: 'Bid or skip',
    category: 'Kriseva terms',
    def: 'The call a supplier’s bid team makes on each tender: pursue it, review it further, or leave it. TAS prepares a brief with the clause behind every reason, and the bid team makes the call.',
    aka: ['bid no-bid', 'go no-go', 'BID REVIEW SKIP'],
    see: ['tender', 'evidence-trail'],
  },
  {
    id: 'evidence-trail',
    term: 'Evidence trail',
    category: 'Kriseva terms',
    def: 'The set of source pages and passages behind each finding or decision, so that anyone can open the page and check it. In Evaluator, every finding links to the page it came from.',
    aka: ['source link', 'provenance', 'page reference'],
    see: ['audit-trail', 'comparative-statement'],
  },
  {
    id: 'audit-trail',
    term: 'Audit trail',
    category: 'Kriseva terms',
    def: 'The time-ordered record of who did what, when and why in a procurement, kept so that an auditor can reconstruct a decision. Kriseva writes its records to a hash-chained log in which one later edit breaks the chain, visibly.',
    aka: ['audit log', 'hash chain', 'tamper-evident record', 'audit query'],
    see: ['evidence-trail', 'technical-evaluation-committee'],
  },
];

export const glossary: GlossTerm[] = [...raw].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

export const termById = new Map(glossary.map((t) => [t.id, t]));
