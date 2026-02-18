# User Stories / Blackbox Testing Template

## 1. User Authentication
Create user stories for login, logout, registration, and session management based on auth requirements in the PRD.

### 1.1 Login Flow
Document each user action and expected outcome for the login process. Derive credentials requirements and validation rules from the technical spec.

### 1.2 Session Management
Define session timeout durations, concurrent session handling, and logout behavior. Clarify with user if session rules are not specified.

## 2. Dashboard & Navigation
Generate user stories for the main interface users see after authentication based on core features in the PRD.

### 2.1 Main Dashboard
Document primary landing page content and interactions. Identify key metrics or widgets from feature requirements.

### 2.2 Navigation Menu
Create stories for menu elements and routing behavior. Derive navigation structure from the feature hierarchy.

## 3. Core Feature Area
Define user stories for primary application workflows. Map each CRUD operation to the main entities in the PRD.

### 3.1 Create/Add
Document user flows for adding new records. Include form fields, validation rules, and success/failure outcomes.

### 3.2 View/Read
Define stories for displaying and browsing data. Include list views, detail views, and any filtering or search functionality.

### 3.3 Edit/Update
Create stories for modifying existing records. Document which fields are editable and any permission constraints.

### 3.4 Delete/Remove
Document deletion flows including confirmation dialogs and soft vs hard delete behavior. Clarify with user if not specified.

## 4. Secondary Feature Area
Identify additional features from the PRD and create corresponding user stories. Ask user to specify if feature scope is unclear.

## 5. Admin/Management Functions
Define admin-specific user stories based on role requirements in the PRD.

### 5.1 User Management
Document admin workflows for creating, editing, and managing user accounts. Include role assignment and permission stories.

## 6. Notifications
Create notification user stories based on key user events in the application workflows.

### 6.1 In-App Notifications
Define notification triggers, display formats, and dismissal behavior. Derive triggers from critical user actions in core features.

## 7. Responsive Design
Document viewport-specific user stories. Clarify target devices with user if not specified in requirements.

### 7.1 Mobile Navigation
Create stories for touch interactions and mobile UI patterns including hamburger menus and swipe gestures.

## 8. Error Handling
Define user stories for error states based on potential failure points in the application flows.

### 8.1 Error States
Document expected behavior for 404, 403, 500 errors, network failures, and form validation errors.

## 9. Accessibility
Create accessibility user stories to ensure WCAG compliance. Include keyboard and screen reader requirements.

### 9.1 Keyboard Navigation
Document tab order, focus management, and keyboard shortcuts for all interactive elements.

### 9.2 Screen Reader
Define ARIA labels, live region announcements, and landmark navigation requirements.
