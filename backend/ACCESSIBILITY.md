# Accessibility documentation for the appointment booking system

---

# What we wanted to be accessibility friendly:

- Making the interface understandable for screen reader users
- Supporting keyboard-only navigation
- Using semantic HTML whenever possible
- Providing clear labels and button text
- Ensuring forms and interactive elements are accessible
- Making the application simple and easy to navigate

The frontend of the project is simple, so accessibility improvements were mostly focused on things like semantic HTML, labels, keyboard navigation and making the interface easier to understand for screen reader users.

---

# Accessibility features we implemented

## 1. Semantic HTML structure

Semantic HTML elements were used to improve screen reader understanding and page structure.

Examples used in the project:

- `<h1>` for the main page heading
- `<h2>` headings for sections such as login, slots, and appointments
- `<button>` elements for actions
- `<ul>` and `<li>` elements for appointment lists
- `<input>` fields for forms
- `<select>` element for appointment slot selection

Using semantic elements helps screen readers identify:

- headings
- interactive controls
- form fields
- lists
- navigation structure

This improves the user experience for visually impaired users.

---

## 2. Clear section tructure

The projects UI was divided into separate visual and structural sections using containers like for example:

- Login section
- Admin section
- Free appointment slots section
- User appointments section
- Logout section

Separating the sections also made the application easier to understand and navigate, especially when using a screen reader or keyboard navigation.
The heading hierarchy also helps screen reader users navigate quickly between sections.

---

## 3. Keyboard accessible buttons

The interface uses native HTML `<button>` elements instead of clickable `<div>` elements. These buttons are automatically keyboard accessible and work correctly with screenreaders.
Users can navigate the interface using tab, enter and space without a mouse. All important actions in the project are accessible using keyboard navigation like:

- Login
- Register
- Book appointment
- Cancel appointment
- Create slot
- Delete slot
- Logout


---

## 4. Form accessibility

The project includes multiple forms:

- Login form
- Registration form
- Admin slot creation form

Accessibility considerations included:

- Clear placeholder text
- Separate fields for different inputs
- Logical order of the fields
- Standard input types like `password` and `datetime-local`


---

## 5. Descriptive button labels

Buttons were given understandable labels, to help screenreader users to understand the purpose of each action, for example:

- “Kirjaudu”
- “Rekisteröidy”
- “Varaa aika”
- “Peruuta”
- “Kirjaudu ulos”
- “Näytä varaukset”


---

## 6. Visibility Based on User Role

The frontend hides admin-only features like slot deletion, admin appointment management and admin slot creation from normal users.
This makes the interface more simple and takes away unnecessary information for users and it improves accessibility and usability.


---

## 7. Error messages and feedback

The interface provides visible feedback for user actions for example:

- “Missing slotId”
- “Slot already booked”
- “Kirjautuminen onnistui!”
- “Varattu”
- “Appointment deleted”

These messages help users understand what happened after they did some action. Alerts and messages were used to improve usability and interaction clarity. 
---

## 8. Preventing invalid actions

The interface prevents some actions that could confuse users like:

- Preventing double booking of appointment slots
- Hiding unavailable appointment slots
- Returning cancelled appointments back to available slots

This again improves usability and prevents inconsistent system behaviour.

---

# Additional accessibility improvements added

We added some small additional improvements to make the frontend more accessible.

## Label suggestions

To improve screen reader support more, `<label>` elements can be connected to input fields. For example:

```html
<label for="email">Email</label>
<input id="email" placeholder="Email">
```

This helps screen readers identify form field purposes more accurately.

---

## ARIA labels

ARIA labels were added because they improve accessibility for buttons and dynamic sections.

for example:

```html
<button aria-label="Book appointment">
  Varaa aika
</button>
```


---

## Focus styling

Added styling that keyboard users can find useful from visible focus states.

Example CSS:

```css
button:focus,
input:focus,
select:focus {
    outline: 3px solid black;
}
```

This makes keyboard navigation easier to follow.

---

# Accessibility evaluation tools

The accessibility of the project was evaluated using browser-based accessibility tools.

## Tool used

The project accessibility was evaluated using

- WAVE Web Accessibility Evaluation Tool
- Browser developer tools

WAVE was used to identify missing labels, contrast issues, structural problems and accessibility warnings.

The browser developer tools were also used to inspect HTML structure, keyboard navigation, visibility of the elements and focus behaviour.

---

# Accessibility testing process

The evaluation process included:

1. Opening the frontend in a browser
2. Running accessibility evaluation tools
3. Checking keyboard navigation manually
4. Testing forms and buttons
5. Verifying heading structure
6. Reviewing dynamic UI behavior

The project frontend was also manually tested by navigating without a mouse.

---

# Issues and challenges

A few accessibility-related issues were identified during development and this task:

## 1. Missing form labels

In the beginning the form fields only used placeholders.

Problem:
- placeholders are not always sufficient for screen readers
- placeholder text disappears while typing

Solution:
- consideration of adding explicit labels
- improving field descriptions

---

## 2. Hidden sections and dynamic content

The interface dynamically hides and shows content depending on login state and user role.

Challenge:

- screen readers may not always announce dynamic content changes automatically

Solution:

- using clear section headings
- simplifying UI structure
- separating admin and user functionality

---

## 3. Simple frontend structure

The project frontend was intentionally kept simple because we knew we will redo it with the vibe-coding task.

Challenge:

- finding balance between keeping it simple and accessibility features
- avoiding unnecessary complexity while still supporting usability

Solution:

- prioritizing semantic HTML and understandable interaction patterns

---

# Screen reader testing

The project was tested conceptually with screen reader accessibility principles in mind.
The screen reader used for testing and evaluation was VoiceOver (macOS). VoiceOver was used to:

- navigate headings
- test button accessibility
- review form field reading behavior
- verify keyboard navigation

The testing worked generally well after adding labels, semantic structure and clearer button descriptions. Some pronunciation challenges appeared 
because the application language was Finnish while the screen reader language settings were different, but the navigation and functionality itself still worked correctly.

---

# Team Responsibilities

## Hanna Hanate

- All parts of accessibility

---

## Ruslan Lysenko

- Did not participate

---

# AI Usage Disclosure

AI tools were used during the project only so that I could check that I had understood the task correctly and to proof read some of this text to check for spelling mistakes.


---

