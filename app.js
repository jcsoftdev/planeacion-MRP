const generateLevelCard = (level = 0, item, values) => {
  try {
    const id = `level${level + 1}`;

    const $content = document.getElementById("content");
    // notas:  template literal no funciona en parametro de getElementById
    const $levelx = document.getElementById(id);
    const nextLevel = !$levelx ? document.createElement("div") : $levelx;
    nextLevel.setAttribute("id", id);

    const childsLevelQuantity = nextLevel.childNodes.length;
    let cardId = childsLevelQuantity + 1;
    console.log("Hijos del level sig", childsLevelQuantity);

    const value = `card-${level - 1}-${cardId}`;

    const levelxValues = values;

    if (levelxValues.name.length === 0) {
      return null;
    }

    const idBtn = `btn-${Number(level) + 1}-${childsLevelQuantity + 1}`;
    const idCard = `card-${Number(level) + 1}-${childsLevelQuantity + 1}`;

    nextLevel.setAttribute("class", `level__content`);
    // console.log(nextLevel)
    const card = document.createElement("div");
    card.setAttribute("class", "card level");
    card.setAttribute("id", `${idCard}`);
    let template = `
          <h2 class="level__title">
            Nivel ${level + 1}: ${levelxValues.name}
          </h2>
          <div class="form-group">
            <label class="form__label" for="name">Nombre</label>
            <input class="form__input"type="text">
          </div>
          <div class="form-group">
            <label class="form__label" for="quantity">Cantidad</label>
            <input class="form__input"  type="text">
          </div>
          <div class="form-group">
            <label class="form__label" for="ss">Stock de seguridad</label>
            <input class="form__input" type="text">
          </div>
          <div class="form-group">
            <label class="form__label" for="availability">Disponibilidad</label>
            <input class="form__input" type="text">
          </div>
          <div class="form-group">
            <label class="form__label" for="ld">Lead Time</label>
            <input class="form__input"  type="text">
          </div>

          <div class="btn-group">
            <button id="${idBtn}" class="btn"> Crear Nivel Inferior </button>
          </div>
    `;

    card.innerHTML = template;

    nextLevel.appendChild(card);

    !$levelx && console.log("prev", $levelx, "nuevo", nextLevel);
    !$levelx && $content.appendChild(nextLevel);

    console.log(idBtn,idCard);
    const btn = document.getElementById(idBtn);


    btn.addEventListener("click", (e) => {
      const myBtn = document.getElementById(idBtn);
      console.log(myBtn.parentNode)
      const cardParent = myBtn.parentNode.parentNode;
      const idCard = cardParent.getAttribute("id");

      console.log(idCard);

      const [c, currentLevel, currentCard] = idCard.split("-");
      console.log("currentLevel", currentLevel, "currentCard", currentCard);

      const values = getLevelValues(cardParent);

      console.log(values);

      generateLevelCard(Number(currentLevel), Number(currentCard), values);
    });
  } catch (error) {
    console.log("error", error);
  }
};

const $getData = document.getElementById("get-data");

const $tableContainer = document.getElementById("table-container");

const generateTable = (n) => {
  let theadItems = ``;
  let tds = ``;
  for (let i = 1; i <= n; i++) {
    theadItems += `<th>${i}</th>`;

    tds += `<td> <input id="week${i}" class="form__input" type="text"> </td>`;
  }
  return `
      <p>Necesidades brutas</p>
      <table>
        <thead>
          ${theadItems}
        </thead>
        <tbody>
          <tr>
            ${tds}
          </tr>
        </tbody>
      </table>
    `;
};

// tomar datos
$getData.childNodes[3].addEventListener("click", (e) => {
  e.preventDefault();
  const value = Number($getData.childNodes[1].childNodes[3].value);
  // console.log(value, typeof value);
  const tableTemplate = generateTable(value);

  $tableContainer.innerHTML = tableTemplate;
});
// console.log(getData.childNodes[3])

const getLevelValues = (card) => {
  try {
    const name = card.childNodes[3].childNodes[3].value;
    const quantity = card.childNodes[5].childNodes[3].value;
    const ss = card.childNodes[7].childNodes[3].value;
    const availability = card.childNodes[9].childNodes[3].value;
    const ld = card.childNodes[11].childNodes[3].value;

    return {
      name,
      quantity,
      ss,
      availability,
      ld,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

const btnPrincipal = document.getElementById("btn-0-1");

btnPrincipal.addEventListener("click", (e) => {
  const cardParent = btnPrincipal.parentNode.parentNode;
  const idCard = cardParent.getAttribute("id");


  const [c, currentLevel, currentCard] = idCard.split("-");

  console.log("currentLevel", currentLevel, "currentCard", currentCard);

  const values = getLevelValues(cardParent);


  generateLevelCard(currentLevel, currentCard, values);
});
