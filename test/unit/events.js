// Make sure that view-selected is fired only when caused internally:
// - autoplay
// - pagination
// - navigation
// - resetting
// - touch / dragging
// - the slides-per-view attribute changes and the selected attribute is not applicable anymore
// - the light dom changed and the selected attribute is not applicable anymore
// Not when
// - next() and prev() are called from outside the component.
// - selected is set from outside the component
//

// Check that the event detail has the right selected index
