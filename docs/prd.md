Product Requirements Document (PRD): AI-Powered Summary & Document Chatbot for StudyZoom

1. Introduction

1.1 Purpose

This PRD defines the requirements for the AI-Powered Summary & Document Chatbot feature in StudyZoom, an AI-powered academic support platform. The feature generates summaries, key points, and a document-specific chatbot for uploaded study materials, integrating with the existing document library, Supabase backend, and OpenAI API to enhance student productivity and understanding.

1.2 Scope





In-Scope:





Generating AI summaries (title, multi-paragraph summary, 5–10 key points).



Providing a document-specific chatbot without suggested prompts.



TurboAI-style UI dashboard (summary/tools on left, chatbot on right).



Supabase integration for caching and metadata storage.



Error handling for AI and API interactions.



Manual summary regeneration



Out-of-Scope:





Document parsing (already implemented: OCR for PDFs/images/PPT, native text for text files).



Billing/paid user role implementation (to be added later dont worry about it now).



Other StudyZoom features (e.g., flashcards, quizzes, podcast generator).



General AI Study Buddy chatbot.

1.3 Stakeholders





Students: Primary users needing intuitive, automated study tools.



Schools/Teachers: Potential users for team/education plans, requiring access to student progress.



Admin (You): Needs ability to manage user roles (free, paid, admin) manually.



Development Team: Responsible for implementation using existing Supabase, React, and parsing infrastructure.

2. Goals and Objectives





Goal: Enable students to quickly understand and interact with uploaded study materials through AI-generated summaries and a context-aware chatbot.



Objectives:





Generate summaries and key points within 5 seconds for 95% of documents using existing parsed text.



Provide accurate, document-specific chatbot responses within 3 seconds.



Ensure seamless integration with existing document library, Supabase backend, and parsing functionality.



Deliver a responsive, student-friendly UI with minimal clicks.

3. User Stories







ID



As a...



I want to...



So that I can...



Priority





US1



Student



See an AI-generated summary for an uploaded document



Quickly grasp the main ideas without reading the entire document



High





US2



Student



View 5–10 key points for a document



Focus on critical concepts for study or review



High





US3



Student



Chat with a document-specific AI about the uploaded material



Get explanations or quizzes based on the document’s content



High





US4



Student



Receive clear error messages if AI processing fails



Understand issues and try again



Medium





US5



Admin



View and manage document metadata in Supabase



Ensure data integrity and user access control



High

4. Functional Requirements

4.1 Document Parsing (F1) - Completed





Description: Parse uploaded documents to extract text for AI processing.



Status: Implemented (OCR for PDFs/images/PPT, native text for text files).



Details: Parsed text is stored in Supabase documents table (parsed_text column).



Acceptance Criteria (Verified):





95% of text-based PDFs and text files parsed without errors.



OCR extracts text from clear scanned PDFs/images in 90% of cases.



User notified of parsing failures.

4.2 AI Summary Generation (F2)





Description: Generate a summary (title, multi-paragraph text, 5–10 key points) on first document open.



Details:





Extract title from filename or metadata.



Use OpenAI API to generate summary (2–3 paragraphs) and key points (5–10 bullets) from parsed text.



Cache results in Supabase documents table (title, summary, key_points columns).



Load cached data on subsequent opens.



Acceptance Criteria:





Summary generated within 5 seconds for typical documents.



Title reflects document content accurately.



Summary includes 2–3 paragraphs; key points list 5–10 items.



Cached data loads instantly on reopen.

4.3 Document-Specific Chatbot (F3)





Description: Provide a chatbot tied to the parsed document content.



Details:





Context limited to document’s parsed text (from F1).



Use OpenAI API with strict context window.



UI: Right sidebar, dark-themed bubble layout with input field (no suggested prompts).



Acceptance Criteria:





Chatbot responds only to document-related queries.



Responses generated within 3 seconds.



UI displays input field clearly in a dark-themed bubble layout.

4.4 Document Dashboard UI (F4)





Description: Display a TurboAI-style dashboard for each document.



Details:





Left (2/3): Title, tool buttons (Flashcards, Quiz, etc.), summary, key points.



Right (1/3): Chatbot with input field (no suggested prompts).



Responsive, student-friendly design using existing React framework.



Acceptance Criteria:





Dashboard renders correctly on desktop and mobile.



Tool buttons are clickable and visually distinct.



Chatbot UI matches dark theme with clear bubble layout.

4.5 Error Handling (F5)





Description: Handle AI and API failures with user notifications.



Details:





Notify users of OpenAI API failures (e.g., “Unable to generate summary; please try again”).



Implement retry logic for API failures (max 3 retries).



Acceptance Criteria:





Users receive clear, non-technical error messages.



API retries succeed in 90% of transient failure cases.

4.6 Supabase Integration (F6)





Description: Store and retrieve document metadata, parsed text, summaries, and key points.



Details:





documents table schema: doc_id (UUID), user_id (UUID), title (text), summary (text), key_points (JSON), parsed_text (text).



Ensure data is tied to user ID for security.



Optimize storage for scalability (e.g., compression, cleanup policies).



Acceptance Criteria:





Metadata stored/retrieved correctly for all documents.



Only authenticated users access their documents.



Storage handles 1000+ documents per user without performance degradation.

5. Non-Functional Requirements





Performance: Summary generation and caching within 5 seconds; chatbot responses within 3 seconds.



Scalability: Supabase storage optimized for large volumes of cached data.



Usability: Responsive, student-friendly UI with minimal clicks.



Security: Document data tied to user ID; accessible only to authenticated users.



Error Handling: Clear notifications for AI/API failures; retry logic for API calls.

6. Success Metrics





User Engagement: 80% of users interact with the summary or chatbot within 1 minute of opening a document.



Performance: 95% of summaries generated within 5 seconds; 95% of chatbot responses within 3 seconds.



Accuracy: 90% of summaries and chatbot responses are accurate based on parsed text.



User Satisfaction: Achieve a 4.5/5 average rating for the feature in user feedback surveys.

7. Assumptions





Existing Supabase setup includes users and documents tables with necessary permissions.



OpenAI API is configured for text parsing and chatbot responses.



React-based UI framework from the homepage can be extended to the dashboard.



Parsing functionality (OCR for PDFs/images/PPT, native text for text files) is fully implemented and provides reliable parsed text.

8. Dependencies





External: OpenAI API.



Internal: Existing Supabase backend (auth, database, file storage), React-based UI framework, implemented parsing functionality.

9. Risks and Mitigations





Risk: OpenAI API latency or failures.





Mitigation: Use retry logic (max 3 retries); cache results to reduce API calls.



Risk: Supabase storage scalability for large documents.





Mitigation: Implement compression and cleanup policies for cached data.



Risk: Chatbot misinterpreting user queries due to lack of suggested prompts.





Mitigation: Ensure clear UI instructions for chatbot usage; monitor user feedback for improvements.

10. Timeline and Milestones





Week 1: Set up Supabase documents table for summaries and key points (F6).



Week 2: Implement AI summary generation and caching (F2).



Week 3: Develop document-specific chatbot without suggested prompts (F3).



Week 4: Build and test dashboard UI (F4).



Week 5: Add error handling and finalize integration (F5, F6).



Week 6: User testing and iteration.

11. Future Considerations





Manual summary regeneration option.



Reintroduce suggested prompts based on user feedback.



Integration with other StudyZoom tools (e.g., flashcards, quizzes).



Billing and paid user role implementation.

THIS IS EXTREMELY IMPORTANT SO LISTEN UP. WHEN IMPLEMENTING THIS FEATURE, YOU HAVE FULL CONTEXT OF EVERYTHING IN THE CODEBASE, SO MAKE SURE THAT YOU DO NOT DISRUPT OR CHANGE ANY OTHER FUNCTIONALITY  SUCH AS AUTH OR DOC UPLOAD OR ETC. AND DO NOT CAUSE ANY TS AND LINT ERRORS. EVERY CHANGE IN CODE, YOU MUST DO A LINT AND TS ERROR CHECK