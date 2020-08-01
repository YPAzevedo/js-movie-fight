const createAutocomplete = ({
  root,
  renderMenuOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" type="text" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results" ></div>
    </div>
  </div>
  <div id="items-container"></div>
`;

  const menuInput = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = debounce(async (event) => {
    const items = await fetchData(event.target.value);

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let item of items) {
      const menuOption = document.createElement("a");

      menuOption.classList.add("dropdown-item");

      menuOption.innerHTML = renderMenuOption(item);

      menuOption.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        menuInput.value = inputValue(item);
        onOptionSelect(item, menuInput);
      });

      resultsWrapper.append(menuOption);
    }
  }, 500);
  // event thats passed inside onInput is the ...args
  menuInput.addEventListener("input", (event) => onInput(event));

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
