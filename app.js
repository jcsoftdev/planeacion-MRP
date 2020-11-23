const store = () => {
  const data = {};
  return {
    pushData: (level, item, d) => {
      const key = `l${level}`;
      // const key = `l${level}-i${item}`;
      // data[key] = { ...data[`l${level}`], [`i${item}`]: d };
      !data[key] && (data[key] = []);
      data[key].push(d);
      // data[key] = [ ...data[key],  d ];
    },
    getData: () => {
      return data;
    },
  };
};

const data = store();

const { getData, pushData } = data;

const $getData = document.getElementById("get-data");
const $tableContainer = document.getElementById("table-container");
const generateTable = (n) => {
  let theadItems = ``;
  let tds = ``;
  for (let i = 1; i <= n; i++) {
    theadItems += `<th>${i}</th>`;

    tds += `<td> <input id="week${i}" class="form__input" type="number"> </td>`;
  }
  return `
      <p>Necesidades brutas</p>
      <table id="tableNB">
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
    const name = card.childNodes[3].childNodes[3];
    const quantity = card.childNodes[5].childNodes[3];
    const ss = card.childNodes[7].childNodes[3];
    const availability = card.childNodes[9].childNodes[3];
    const lt = card.childNodes[11].childNodes[3];
    let parent = card.getAttribute("data");
    return {
      name: name.value,
      quantity: Number(quantity.value),
      ss: Number(ss.value),
      availability: Number(availability.value),
      lt: Number(lt.value),
      parent: parent,
      disable: (e) => {
        name.disabled = true;
        quantity.disabled = true;
        ss.disabled = true;
        availability.disabled = true;
        lt.disabled = true;
      },
      // setCurrent: function (e) {
      //   console.log("seteando parente", e);
      //   parent = e;
      //   this.parent = e;
      //   console.log(parent);
      // },
      // getCurrent:()=>{
      //   return parent
      // }
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

const verifyData = (node) => {
  const cardParent = node.parentNode.parentNode;
  const idCard = cardParent.getAttribute("id");
  const [c, currentLevel, currentCard] = idCard.split("-");

  // console.log("currentLevel", currentLevel, "currentCard", currentCard);

  const values = getLevelValues(cardParent);
  let error = false;

  if (values.name.length === 0) {
    error = true;
  } else if (values.quantity === 0) {
    error = true;
  } else if (values.ss === 0) {
    error = true;
  } else if (values.availability === 0) {
    error = true;
  } else if (values.ld === 0) {
    error = true;
  } else {
    error = false;
    node.parentNode.childNodes[5] &&
      node.parentNode.removeChild(node.parentNode.childNodes[5]);
  }
  if (error) {
    let e = document.createElement("div");
    e.innerHTML =
      '<span style="display:block; color:red; margin-top:.75rem">Rellene los datos</span>';
    !node.parentNode.childNodes[5] && node.parentNode.appendChild(e);
    return null;
  }
  // node.parentNode.childNodes[3].removeAttribute('disabled')

  node.style.display = "none";
  node.parentNode.childNodes[3].style.display = "block";
  return {
    currentLevel: Number(currentLevel),
    currentCard: Number(currentCard),
    values,
  };
};

const generateLevelCard = (level = 0, item, values) => {
  try {
    const id = `level${level + 1}`;

    const $content = document.getElementById("content");
    // notas:  template literal no funciona en parametro de getElementById
    const $levelx = document.getElementById(id);
    const nextLevel = !$levelx ? document.createElement("div") : $levelx;
    nextLevel.setAttribute("id", id);

    const childsLevelQuantity = nextLevel.childNodes.length;

    const idBtn = `btn-${Number(level) + 1}-${childsLevelQuantity + 1}`;
    const idCard = `card-${Number(level) + 1}-${childsLevelQuantity + 1}`;

    nextLevel.setAttribute("class", `level__content`);
    // console.log(nextLevel)
    const card = document.createElement("div");
    card.setAttribute("class", "card level");
    card.setAttribute("data", `${values.name}`);
    card.setAttribute("id", `${idCard}`);

    let template = `
          <h2 class="level__title">
            Nivel ${level + 1}: ${values.name}
          </h2>
          <div class="form-group">
            <label class="form__label" for="name">Nombre/Codigo</label>
            <input class="form__input"type="text">
          </div>
          <div class="form-group">
            <label class="form__label" for="quantity">Cantidad</label>
            <input class="form__input"  type="number">
          </div>
          <div class="form-group">
            <label class="form__label" for="ss">Stock de seguridad</label>
            <input class="form__input" type="number">
          </div>
          <div class="form-group">
            <label class="form__label" for="availability">Disponibilidad</label>
            <input class="form__input" type="number">
          </div>
          <div class="form-group">
            <label class="form__label" for="ld">Lead Time (Semanas)</label>
            <input class="form__input"  type="number">
          </div>

          <div class="btn-group">
            <button id="${idBtn}" class="btn"> Validar datos </button>
            <button style="display: none;" class="btn"> Crear Nivel Inferior </button>
          </div>
    `;

    card.innerHTML = template;

    nextLevel.appendChild(card);

    !$levelx && console.log("prev", $levelx, "nuevo", nextLevel);
    !$levelx && $content.appendChild(nextLevel);

    console.log(idBtn, idCard);
    const btn = document.getElementById(idBtn);

    btn.addEventListener("click", (e) => {
      handleClick(btn);
    });
  } catch (error) {
    console.log("error", error);
  }
};

const handleClick = (node, isFirst = true) => {
  const data = verifyData(node);

  data && data.values.disable();
  data && pushData(data.currentLevel, data.currentCard, data.values);
  data &&
    node.parentNode.childNodes[3].addEventListener("click", (e) => {
      generateLevelCard(data.currentLevel, data.currentCard, data.values);
    });
};

const btnPrincipal = document.getElementById("btn-0-1");
const btnCalcular = document.getElementById("calcular");
btnPrincipal.addEventListener("click", (e) => {
  handleClick(btnPrincipal);
  btnCalcular.style.display = "block";
});

const getNB = (e) => {
  const $table = document.getElementById("tableNB");
  const node = $table.childNodes[3].childNodes[1].childNodes;

  const quantity = node.length - 2;
  const values = [];
  for (let i = 1; i <= quantity; i++) {
    values.push(Number(node[i].childNodes[1].value));
  }

  return values;
};

const storeTables = () => {
  let tables = [];
  return {
    pushData: (param) => {
      tables.push(param);
    },
    getData: () => {
      return tables;
    },
    getTable: function (name) {
      // tables.forEach(element => {

      // });
      return tables.filter((el) => (el.name = name));
    },
  };
};

const renderResult = (
  data = [
    {
      name: "",
      NB: "",
      availability: new Array(3),
      SS: new Array(3),
      NN: new Array(3),
      EOP: new Array(3),
    },
  ],
  node
) => {
  console.log(node);
  let template = "";
  data.forEach((el) => {
    let theadItems = `<th>Semanas</th>`;

    let rowEOP = "<th>Emisiones de Ordenes Planificadas</th>";
    let rowNB = "<th>Necesidades Brutas</th>";
    let rowAvailability = "<th>Disponibilidad</th>";
    let rowSS = "<th>Stock de Seguridad</th>";
    let rowNN = "<th>Necesidades Netas</th>";
    el.EOP.map((e) => {
      rowEOP += `<td>${e}</td>`;
    });
    el.availability.map((e) => {
      rowAvailability += `<td>${e}</td>`;
    });
    el.NB.map((e) => {
      rowNB += `<td>${e}</td>`;
    });
    el.SS.map((e) => {
      rowSS += `<td>${e}</td>`;
    });
    el.NN.map((e) => {
      rowNN += `<td>${e}</td>`;
    });

    let trs = `<tr>
        
          ${rowNB}
          </tr>
          <tr>
          ${rowAvailability}
          </tr>
          <tr>
          ${rowSS}
          </tr>
          <tr>
          ${rowNN}
          </tr>
          <tr>
          ${rowEOP}
        </tr>
        `;
    for (let i = 1; i <= el.EOP.length; i++) {
      theadItems += `<th>S-${i}</th>`;
    }
    template += `
    <div class="table-wrapper">
      <p>${el.name}</p>
      <table class="fl-table">
        <thead>
          ${theadItems}
        </thead>
        <tbody>
          ${trs}
        </tbody>
      </table>
    </div>
    `;
  });
  node.innerHTML = template;
  return template;
};

const calcular = () => {
  const data = getData();
  const NB = getNB();
  const arrayData = Object.keys(data);
  if (!NB.length) {
    return null;
  }
  const tables = storeTables();

  // accedemos a todos los niveles

  for (let i = 0; i < arrayData.length; i++) {
    // accedemos a los items de cada nivel
    i === 0
      ? data[`l${i}`].forEach((el) => {
          let table = {
            name: "",
            NB: NB,
            availability: new Array(NB.length),
            SS: new Array(NB.length),
            NN: new Array(NB.length),
            EOP: new Array(NB.length),
          };
          table.name = el.name;
          for (let week = 0; week < NB.length; week++) {
            week === 0
              ? (table.availability[week] = el.availability)
              : (table.availability[week] =
                  table.availability[week - 1] - table.NB[week - 1] < 0
                    ? 0
                    : table.availability[week - 1] - table.NB[week - 1]);
            table.SS[week] = el.ss;
            table.availability[week] > 0
              ? (table.NN[week] =
                  table.NB[week] - table.availability[week] + table.SS[week])
              : (table.NN[week] = table.NB[week]);
          }

          for (let week = 0; week < NB.length; week++) {
            week + el.lt <= NB.length - 1
              ? (table.EOP[week] = table.NN[week + el.lt])
              : (table.EOP[week] = 0);
          }

          tables.pushData(table);
        })
      : data[`l${i}`].forEach((el) => {
          let table = {
            name: "",
            NB: NB,
            availability: new Array(NB.length),
            SS: new Array(NB.length),
            NN: new Array(NB.length),
            EOP: new Array(NB.length),
          };
          console.log("============>");
          table.name = el.name;

          tables.getData().forEach((t) => {
            if (t.name === el.parent) {
              table.NB = t.EOP;
            }
          });

          for (let week = 0; week < NB.length; week++) {
            week === 0
              ? (table.availability[week] = el.availability)
              : (table.availability[week] =
                  table.availability[week - 1] - table.NB[week - 1] < 0
                    ? 0
                    : table.availability[week - 1] - table.NB[week - 1]);
            table.SS[week] = el.ss;
            table.availability[week] > 0
              ? (table.NN[week] =
                  table.NB[week] - table.availability[week] + table.SS[week])
              : (table.NN[week] = table.NB[week]);
          }

          for (let week = 0; week < NB.length; week++) {
            week + el.lt <= NB.length - 1
              ? (table.EOP[week] = el.cantidad*(table.NN[week + el.lt]))
              : (table.EOP[week] = 0);
          }

          tables.pushData(table);
        });
  }
  console.log(tables.getData());
  const $result = document.getElementById("result");

  const t = renderResult(tables.getData(), $result);
  console.log(t);
};

// const btnCalcular = document.getElementById('calcular')
// btnCalcular.addEventListener('click',(e)=>{

// })
