1. Feature Goal
Enable students to upload any study material—regardless of size or format—in a smooth, reliable way. After upload, the system should automatically kick off the appropriate parsing/transcription (OCR, video transcription, PPT text extraction, etc.) so that AI tools (quizzes, chatbots, flashcards) can work on the content immediately.

2. Supported File Types & Sizes
Documents: PDF, PowerPoint/PPTX, Word/DOCX, TXT

Images: JPEG, PNG, TIFF (including scans of handwritten notes)

Presentations: Keynote, Google Slides exports

Video/Audio: MP4, MOV, AVI, MP3, WAV (for future transcription)

Archives: ZIP (containing any mix of the above)

Max File Size: Up to 1 GB per file—many study materials are large.

3. Core Requirements
Drag-and-Drop + File Picker

Users can drag files into a drop zone or click to browse.

Multiple-file selection and batch upload support.

Resumable & Chunked Uploads

Large files must upload in reliable chunks with automatic retry.

Show per-file and overall progress bars.

Handle network interruptions smoothly—resume where left off.

Robust Validation & Feedback

Instantly validate file types, sizes, and total upload quota.

Immediate, clear error messages for unsupported types or oversized files.

Visual indicators for “uploading,” “processing,” “complete,” and “failed.”

Preview & Metadata Extraction

Show thumbnails/previews for images and first-page PDF slides.

Display basic metadata (file name, size, page count or duration for video).

Allow users to remove or replace any uploaded file before finalizing.

Automatic Content Parsing Pipelines

Text Documents & PPTX → extract raw text and structure (headings, bullet points).

PDFs & Images → run OCR (including multi-column layouts and handwritten text).

Videos/Audios → generate transcripts (for future chat and quiz features).

Kick off these pipelines immediately after successful upload, with status updates.

Scalability & Robustness

Architect for high concurrency—many users uploading simultaneously.

Queue uploads and parsing jobs reliably, with retry and back-off for failures.

Monitor and log errors for quick debugging.

4. Example User Workflows
Workflow A: Large Lecture Slides
Student drags a 500 MB PPTX file into the drop zone.

Progress bar shows chunked upload progress (60 seconds remaining).

After upload, “Processing: Extracting text from slides” appears.

Within 30 seconds, the document dashboard updates with “Ready” status and slide previews.

5. UX & Edge-Case Handling
Mobile-Friendly: Ensure drag-and-drop falls back to file picker on touch devices.

Disabled States: While uploading or processing, disable “Next” or other navigation to prevent confusion.

Bulk Actions: Let users remove, retry, or prioritize specific files in a batch.

Accessibility: Keyboard navigation, screen-reader labels, and clear color contrasts.

6. Conversion & Retention Hooks
After upload success, show a quick prompt:
“Great! Now transform this into flashcards, quizzes, or chat—click here to start.”

If processing takes longer than 10 seconds, use a micro-animation or friendly message (“Good things take time!”) to reassure users.

Your mission:
Turn this spec into a production-ready upload module. Deliver wireframes or UI sketches for review, then implement the feature fully—ensuring uploads of any size/type succeed, parsing pipelines kick off automatically, and users get immediate, clear feedback at every step.

VERY IMPORTANT LISTEN UP:
WE ARE USING supabase for databse/ backend/storage. (btw i dont have docker, so i will be manually copy pasting sql files into supabase)

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md] file with a summary of the changes you made and any other relevant information.

AS THE CEO OF STUDYZOOM, you must have context of everything you are doing. You must ensure that after implementing the plan, THE FEATURE WILL FUNCTION PERFECTLY WITH NO ERRORS, THE PROCCESS OF USING THIS FEATURE IS SMOOTH. Not only that, by implementing this feature, YOU ARE NOT changing or disrupting functionality in other areas of the codebase such as auth or database or etc. You will leave NO TS OR LINT ERRORS BEHIND. You must ensure all of this is clean.
