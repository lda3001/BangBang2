export function bindInput(state) {
  const onMouseMove = (event) => {
    state.input.mouseX = event.clientX;
    state.input.mouseY = event.clientY;
    state.input.worldMouseX = event.clientX / state.camera.zoom + state.camera.x;
    state.input.worldMouseY = event.clientY / state.camera.zoom + state.camera.y;
  };

  const onMouseDown = (event) => {
    if (event.button === 2) {
      event.preventDefault();
    }

    if (event.button === 2 && state.input.aimingSkill) {
      state.input.cancelAim = true;
      state.input.aimingSkill = null;
      return;
    }

    if (event.button === 0) {
      if (state.input.aimingSkill) {
        state.input.pendingCast = state.input.aimingSkill;
        state.input.aimingSkill = null;
        state.input.cancelAim = false;
      } else {
        state.input.isShooting = true;
      }
    }
  };

  const onMouseUp = (event) => {
    if (event.button === 0) {
      state.input.isShooting = false;
    }
  };

  const onKeyDown = (event) => {
    state.input.keys[event.code] = true;
  };

  const onKeyUp = (event) => {
    state.input.keys[event.code] = false;
  };

  const onBlur = () => {
    // Prevent stuck movement when window/tab loses focus.
    state.input.keys = {};
    state.input.isShooting = false;
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  return function unbindInput() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
  };
}

