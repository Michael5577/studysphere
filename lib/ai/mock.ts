import type { AssistantMode } from "@/lib/ai/types";
import { extractTopic, isVagueMessage, messageMatches } from "@/lib/ai/parse-message";

interface TopicEntry {
  keywords: string[];
  chat: string;
  summarize: string;
  flashcards: string;
}

const KNOWLEDGE: TopicEntry[] = [
  {
    keywords: ["operating system", "operating systems", " os ", "kernel", "process scheduling"],
    chat: [
      "An operating system is the software layer between your applications and the computer hardware. Think of it as the campus facilities team for your laptop — it decides who gets the CPU, memory, and disk, and keeps everything from colliding.",
      "",
      "Core jobs of an OS",
      "1. Process management — runs programs, switches between them, and tracks their state (running, waiting, terminated).",
      "2. Memory management — gives each app its own address space and prevents one app from reading another app's data.",
      "3. File systems — organizes storage so you can save, open, and find files reliably.",
      "4. Device drivers — translate generic requests into hardware-specific instructions for keyboard, display, network, and storage.",
      "5. Security and permissions — decides which users and programs can access which resources.",
      "",
      "How to remember it for an exam",
      "User app → system call → kernel → hardware. If a question asks for examples: Windows, macOS, Linux, iOS, and Android are all operating systems.",
      "",
      "If you tell me your course (CS 101 vs a systems class), I can go deeper on scheduling, paging, or syscalls.",
    ].join("\n"),
    summarize: [
      "Operating systems — quick summary",
      "",
      "Definition: Software that manages hardware and provides services to applications.",
      "",
      "Key ideas",
      "• The kernel is the core of the OS and runs in a privileged mode.",
      "• Processes are programs in execution; the OS schedules CPU time among them.",
      "• Virtual memory lets each process think it owns contiguous memory.",
      "• Files and directories are an abstraction over disk blocks.",
      "",
      "Exam anchors: process states, CPU scheduling, memory paging, file systems, system calls.",
      "",
      "Study tip: Draw the stack — application → API/library → system call → kernel → hardware.",
    ].join("\n"),
    flashcards: [
      "Operating systems — flashcards",
      "",
      "Card 1",
      "Q: What is an operating system?",
      "A: System software that manages hardware resources and provides services to applications.",
      "",
      "Card 2",
      "Q: What is the kernel?",
      "A: The core part of the OS that runs with high privilege and controls hardware directly.",
      "",
      "Card 3",
      "Q: What is a process?",
      "A: A program in execution, with its own memory space and state managed by the OS.",
      "",
      "Card 4",
      "Q: What is virtual memory?",
      "A: An abstraction that gives each process its own address space, often larger than physical RAM.",
      "",
      "Card 5",
      "Q: What is a system call?",
      "A: A controlled entry point from user mode into the kernel to request OS services.",
    ].join("\n"),
  },
  {
    keywords: ["photosynthesis", "cellular respiration", "mitochondria", "chloroplast"],
    chat: [
      "Photosynthesis is how plants convert light energy into chemical energy stored in glucose.",
      "",
      "In plain terms",
      "• Inputs: carbon dioxide, water, and light.",
      "• Outputs: glucose and oxygen.",
      "• Location: chloroplasts in plant cells.",
      "",
      "The two big stages students memorize",
      "1. Light-dependent reactions — capture light in thylakoid membranes and produce ATP and NADPH.",
      "2. Calvin cycle — uses that ATP and NADPH to build sugar from CO2.",
      "",
      "Contrast tip: cellular respiration breaks glucose down for ATP; photosynthesis builds glucose using light. They are complementary processes.",
    ].join("\n"),
    summarize: [
      "Photosynthesis — summary",
      "",
      "Purpose: Convert light energy into chemical energy (glucose).",
      "Where: Chloroplasts.",
      "Inputs: CO2, H2O, light.",
      "Outputs: C6H12O6 (glucose), O2.",
      "",
      "Light reactions: thylakoids → ATP + NADPH + O2 released.",
      "Calvin cycle: stroma → fixes carbon into sugar using ATP and NADPH.",
      "",
      "Study tip: Know the inputs/outputs and where each stage happens before memorizing enzyme names.",
    ].join("\n"),
    flashcards: [
      "Photosynthesis — flashcards",
      "",
      "Card 1",
      "Q: Where does photosynthesis occur?",
      "A: In chloroplasts, mainly in plant leaves.",
      "",
      "Card 2",
      "Q: What are the inputs of photosynthesis?",
      "A: Carbon dioxide, water, and light energy.",
      "",
      "Card 3",
      "Q: What are the outputs?",
      "A: Glucose and oxygen.",
      "",
      "Card 4",
      "Q: What happens in the light-dependent reactions?",
      "A: Light is absorbed and converted into ATP and NADPH; oxygen is released.",
      "",
      "Card 5",
      "Q: What does the Calvin cycle do?",
      "A: Uses ATP and NADPH to assemble sugar from CO2.",
    ].join("\n"),
  },
  {
    keywords: ["linked list", "binary tree", "data structure", "big o", "time complexity"],
    chat: [
      "Data structures are how you organize information so your code can store and retrieve it efficiently.",
      "",
      "Start with the tradeoff question",
      "What operation matters most — lookup, insert, delete, or traversal?",
      "",
      "Common structures and when they shine",
      "• Array — fast index access, costly middle inserts.",
      "• Linked list — cheap inserts/deletes at known positions, slow random access.",
      "• Stack / queue — process items in LIFO or FIFO order.",
      "• Hash table — average fast lookup if you can tolerate extra memory.",
      "• Binary tree — ordered data with efficient search when balanced.",
      "",
      "Exam move: state the structure, the time complexity of the operation you care about, and one real use case (e.g., undo stack, task queue, database index).",
    ].join("\n"),
    summarize: [
      "Data structures — summary",
      "",
      "Goal: Match the structure to the operations your problem needs most.",
      "",
      "Arrays: O(1) access, O(n) insert in middle.",
      "Linked lists: O(1) insert at head, O(n) search.",
      "Stacks/queues: constrained access patterns for algorithms.",
      "Trees: hierarchical data, search roughly O(log n) when balanced.",
      "Hash tables: fast average lookup with a good hash function.",
      "",
      "Study tip: For each structure, write one sentence on what it is good at and one on what it is bad at.",
    ].join("\n"),
    flashcards: [
      "Data structures — flashcards",
      "",
      "Card 1",
      "Q: When is an array a good choice?",
      "A: When you need fast random access by index.",
      "",
      "Card 2",
      "Q: Main advantage of a linked list?",
      "A: Efficient inserts and deletes when you already have a pointer to the position.",
      "",
      "Card 3",
      "Q: What is a stack used for?",
      "A: LIFO access — examples include undo history and parsing expressions.",
      "",
      "Card 4",
      "Q: What does O(log n) usually suggest?",
      "A: A divide-and-conquer or tree-based approach that halves the search space.",
    ].join("\n"),
  },
  {
    keywords: ["database index", "database indexes", "db index", "sql index"],
    chat: [
      "A database index is a lookup structure — like the index at the back of a textbook — that helps the database find rows faster without scanning every row in a table.",
      "",
      "Why it matters",
      "Without an index, a query may do a full table scan (O(n)). With the right index, lookups can drop to roughly O(log n) for B-tree indexes.",
      "",
      "Example",
      "If users have an email column and you run SELECT * FROM users WHERE email = 'demo@studysphere.app', an index on email lets the database jump straight to matching rows instead of reading the whole table.",
      "",
      "Coursework connection",
      "Indexes speed up reads but cost extra storage and slow down writes (inserts/updates must maintain the index). Professors often ask you to trade off query speed vs. write overhead.",
      "",
      "Check yourself: Why might too many indexes hurt INSERT performance?",
    ].join("\n"),
    summarize: [
      "Database indexes — summary",
      "",
      "Main idea: An index is a separate data structure that maps indexed column values to row locations for faster retrieval.",
      "",
      "Key points",
      "• B-tree indexes are the default in most relational databases.",
      "• Indexes help WHERE, JOIN, and ORDER BY on indexed columns.",
      "• Tradeoff: faster reads, slower writes, more disk use.",
      "",
      "Action items",
      "• Identify columns used in frequent filters or joins.",
      "• Use EXPLAIN / query plans to see if a scan becomes an index seek.",
      "• Avoid indexing every column — index what your queries actually use.",
    ].join("\n"),
    flashcards: [
      "Database indexes — flashcards",
      "",
      "Card 1",
      "Q: What is a database index?",
      "A: A structure that maps key values to row locations so queries can find data without scanning the entire table.",
      "",
      "Card 2",
      "Q: What problem do indexes solve?",
      "A: Slow full table scans on large tables when filtering or joining on specific columns.",
      "",
      "Card 3",
      "Q: What is a common tradeoff of adding indexes?",
      "A: Faster reads, but inserts/updates/deletes may slow down because the index must be updated too.",
      "",
      "Card 4",
      "Q: When is an index most useful?",
      "A: On columns frequently used in WHERE clauses, JOIN conditions, or ORDER BY.",
      "",
      "Card 5",
      "Q: What does a query plan showing \"index scan\" suggest?",
      "A: The optimizer is using an index instead of reading every row in the table.",
    ].join("\n"),
  },
  {
    keywords: ["binary search tree", "binary search trees", " bst ", "bst node"],
    chat: [
      "A binary search tree (BST) is a tree where each node has at most two children, and for every node: left subtree values are smaller, right subtree values are larger.",
      "",
      "Why it matters",
      "BSTs give efficient search, insert, and delete when the tree stays balanced — roughly O(log n) instead of O(n) for a sorted array insert or unsorted list search.",
      "",
      "Example",
      "Insert 8, 3, 10, 1, 6 into a BST: 8 is root; 3 goes left; 10 goes right; 1 left of 3; 6 right of 3. Searching for 6 compares at 8, then 3, then 6.",
      "",
      "Coursework connection",
      "CS classes use BSTs before AVL/red-black trees. Know in-order traversal (sorted output), worst-case skew (degrades to O(n)), and why self-balancing trees exist.",
      "",
      "Check yourself: What happens to search time if you insert sorted data into a plain BST?",
    ].join("\n"),
    summarize: [
      "Binary search trees — summary",
      "",
      "Main idea: A hierarchical structure with the BST property enabling ordered search.",
      "",
      "Key points",
      "• Each node: left < node < right.",
      "• Search/insert/delete average O(log n) when balanced.",
      "• Worst case O(n) if the tree becomes a linked list (skewed).",
      "• In-order traversal visits nodes in sorted order.",
      "",
      "Action items",
      "• Practice insert and search on paper.",
      "• Compare BST vs. hash table: ordered traversal vs. average O(1) lookup.",
      "• Review balanced variants (AVL, red-black) if your syllabus covers them.",
    ].join("\n"),
    flashcards: [
      "Binary search trees — flashcards",
      "",
      "Card 1",
      "Q: What is the BST property?",
      "A: For every node, all values in the left subtree are smaller and all values in the right subtree are larger.",
      "",
      "Card 2",
      "Q: What is the average time complexity of search in a balanced BST?",
      "A: O(log n).",
      "",
      "Card 3",
      "Q: What is the worst-case search time in a skewed BST?",
      "A: O(n), when the tree degenerates into a chain.",
      "",
      "Card 4",
      "Q: Which traversal prints BST values in sorted order?",
      "A: In-order traversal (left, node, right).",
      "",
      "Card 5",
      "Q: Why use a self-balancing BST?",
      "A: To prevent skew and keep operations at O(log n) even with sorted input.",
    ].join("\n"),
  },
  {
    keywords: ["recursion", "recursive", "base case"],
    chat: [
      "Recursion is when a function calls itself to solve a smaller version of the same problem until it hits a base case.",
      "",
      "Why it matters",
      "Many algorithms (tree walks, divide-and-conquer, backtracking) are natural to write recursively. Interview and exam questions often test whether you can identify base case, recursive step, and stack depth.",
      "",
      "Example",
      "factorial(n): base case n <= 1 returns 1; otherwise return n * factorial(n - 1). factorial(4) = 4 * 3 * 2 * 1 = 24.",
      "",
      "Coursework connection",
      "Watch for stack overflow on deep recursion, and know when to convert to iteration or use memoization (dynamic programming).",
      "",
      "Check yourself: What are the base case and recursive step in binary search on a sorted array?",
    ].join("\n"),
    summarize: [
      "Recursion — summary",
      "",
      "Main idea: A function solves a problem by calling itself on smaller subproblems until a base case stops the chain.",
      "",
      "Key points",
      "• Every recursive function needs a base case and a progress toward that base case.",
      "• Each call adds a stack frame — deep recursion can overflow the call stack.",
      "• Memoization caches results to avoid redundant recursive work.",
      "",
      "Action items",
      "• Rewrite one recursive function iteratively to compare.",
      "• Trace factorial(4) or fib(5) on paper showing the call stack.",
      "• Identify recursion in tree traversals from your data structures unit.",
    ].join("\n"),
    flashcards: [
      "Recursion — flashcards",
      "",
      "Card 1",
      "Q: What is recursion?",
      "A: A technique where a function calls itself to solve smaller instances of the same problem.",
      "",
      "Card 2",
      "Q: What is a base case?",
      "A: The simplest input that returns directly without another recursive call.",
      "",
      "Card 3",
      "Q: What risk comes with deep recursion?",
      "A: Stack overflow from too many nested call frames.",
      "",
      "Card 4",
      "Q: What does memoization do?",
      "A: Stores results of subproblems so repeated recursive calls reuse cached answers.",
    ].join("\n"),
  },
  {
    keywords: ["study session", "study plan", "plan my", "pomodoro", "midterm", "exam prep"],
    chat: [
      "Here is a focused 2-hour study block you can run in StudySphere Focus mode.",
      "",
      "Block plan",
      "0:00–0:25 — Hardest material only (active recall, no highlights).",
      "0:25–0:30 — Short break: water, stretch, no phone scrolling.",
      "0:30–0:55 — Practice problems or flashcards on the same topic.",
      "0:55–1:00 — Break.",
      "1:00–1:25 — Review mistakes from the last block and rewrite weak notes.",
      "1:25–1:30 — Break.",
      "1:30–1:55 — Mixed review quiz across all topics for this course.",
      "1:55–2:00 — Write three questions you still cannot answer — those are tomorrow's first task.",
      "",
      "Rule: one course, one outcome per block. Open Focus, pick Lo-fi or Library ambient, and start the first 25-minute session.",
    ].join("\n"),
    summarize: [
      "Study session plan — summary",
      "",
      "Structure: 3 × 25-minute focus blocks with 5-minute breaks, then a 5-minute wrap-up.",
      "",
      "Priority order",
      "1. Hardest concept first while energy is highest.",
      "2. Practice problems second.",
      "3. Mixed review and error log last.",
      "",
      "Study tip: End every block by writing one thing that is still fuzzy — that becomes the next session's opener.",
    ].join("\n"),
    flashcards: [
      "Study planning — flashcards",
      "",
      "Card 1",
      "Q: What should the first Pomodoro cover?",
      "A: The hardest topic while your focus is freshest.",
      "",
      "Card 2",
      "Q: What belongs in a break?",
      "A: Movement, water, and a screen break — not new content.",
      "",
      "Card 3",
      "Q: How do you close a study session?",
      "A: List 2–3 questions you still cannot answer and schedule them next.",
    ].join("\n"),
  },
];

function findTopicEntry(message: string): TopicEntry | null {
  return KNOWLEDGE.find((entry) => messageMatches(message, entry.keywords)) ?? null;
}

function clarifyingReply(mode: AssistantMode): string {
  if (mode === "summarize") {
    return [
      "I can summarize that — paste your notes or tell me the topic and course.",
      "",
      "For example: \"Summarize the causes of the French Revolution\" or paste a paragraph from your lecture slides.",
    ].join("\n");
  }

  if (mode === "flashcards") {
    return [
      "Happy to build flashcards — which topic and course should I use?",
      "",
      "For example: \"Flashcards for photosynthesis in BIO 110\" or \"Key terms from Chapter 4 of Data Structures.\"",
    ].join("\n");
  }

  return [
    "I can help with that — what topic or assignment should we focus on?",
    "",
    "Try asking something specific, like:",
    "• What is an operating system?",
    "• Explain photosynthesis in simple terms",
    "• Help me plan a 2-hour study session for my midterm",
  ].join("\n");
}

function offlineUnavailableReply(mode: AssistantMode, topic: string | null): string {
  const subject = topic ? `"${topic}"` : "that";

  if (mode === "summarize") {
    return `I can't summarize ${subject} without live AI. Add OPENAI_API_KEY to .env.local, restart the dev server, then paste your notes here.`;
  }

  if (mode === "flashcards") {
    return `I can't build flashcards for ${subject} without live AI. Add OPENAI_API_KEY to .env.local, restart the dev server, then try again.`;
  }

  return `I can't explain ${subject} without live AI. Add OPENAI_API_KEY to .env.local and restart the dev server — or try a demo prompt from the empty state.`;
}

export function generateMockAssistantReply(
  mode: AssistantMode,
  message: string,
): string {
  if (isVagueMessage(message)) {
    return clarifyingReply(mode);
  }

  const entry = findTopicEntry(message);

  if (entry) {
    if (mode === "summarize") {
      return entry.summarize;
    }

    if (mode === "flashcards") {
      return entry.flashcards;
    }

    return entry.chat;
  }

  const topic = extractTopic(message);

  if (!topic) {
    return clarifyingReply(mode);
  }

  return offlineUnavailableReply(mode, topic);
}
