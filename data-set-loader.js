function getGraphDataSets() {
  const loadMiserables = function (Graph) {
    Graph.nodeLabel('id')
      .nodeAutoColorBy('group')
      .jsonUrl('./data/miserables.json');
  };
  loadMiserables.description =
    "<em>Les Miserables</em> data (<a href='https://bl.ocks.org/mbostock/4062045'>4062045</a>)";

  //

  const loadBlocks = function (Graph) {
    Graph.nodeLabel(
      (node) =>
        `${node.user ? node.user + ': ' : ''}${node.description || node.id}`
    )
      .nodeAutoColorBy('user')
      .jsonUrl('./data/blocks.json');
  };
  loadBlocks.description =
    "<em>Blocks</em> data (<a href='https://bl.ocks.org/mbostock/afecf1ce04644ad9036ca146d2084895'>afecf1ce04644ad9036ca146d2084895</a>)";

  //

  const loadD3Dependencies = function (Graph) {
    fetch('./data/d3_deps.csv')
      .then((r) => r.text())
      .then(d3.csvParse)
      .then((data) => {
        console.log(data);
        const nodes = [],
          links = [];
        data.forEach(({ size, path }) => {
          const levels = path.split('/'),
            module = levels.length > 1 ? levels[1] : null,
            leaf = levels.pop(),
            parent = levels.join('/');

          nodes.push({
            path,
            leaf,
            module,
            size: +size || 1,
          });

          if (parent) {
            links.push({ source: parent, target: path });
          }
        });

        Graph.nodeRelSize(0.5)
          .nodeId('path')
          .nodeVal('size')
          .nodeLabel('path')
          .nodeAutoColorBy('module')
          .graphData({ nodes, links });

        console.log('nodes: ', nodes);
        console.log('links: ', links);
      });
  };
  loadD3Dependencies.description =
    "<em>D3 dependencies</em> data (<a href='https://bl.ocks.org/mbostock/9a8124ccde3a4e9625bc413b48f14b30'>9a8124ccde3a4e9625bc413b48f14b30</a>)";

  //////////////////////////////////////////////////////

  const sankeydata = {
    // set up graph object arrays
    nodes: [],
    links: [],
    unlinked: [], // array of items that are not found in namesArr
  };
  let arri = []; // childrens array of arrays for colorizing links
  function prepareData(data) {
    //console.log(data);
    // lsObj.dataIs = convertToCsv(data); // convert parsed JSON data to CSV
    // setLSItem('w_nf', lsObj); // add data to local storage in CSV format
    // first - go through data to make array of IDS and Names
    namesArr = [{ id: '', name: '' }]; // all ID names in db
    data.forEach((d) =>
      d.pID //only if id exists
        ? namesArr.push({
            id: parseInt(d.pID),
            name: d.pName,
            birthlastname: d.pBirthLastName,
            maritallastname: d.pMaritalLastName,
            fixedlayer: parseInt(d.pFixLayer),
            birthday: d.pBDay,
            birthplace: d.pBirthPlace,
            deathday: d.pDDay,
            deathplace: d.pDeathPlace,
            note: d.pNote,
          })
        : ''
    );

    // second - go through rows of data - two partners, multiple children
    /* prettier-ignore */
    data.forEach((d) => {
      // loop only if values in column partners
      if (d.partners) {
        // find names for ids
        let nameP, nameC;
        let pr = d.partners.split(',');
        let ch = d.children.split(',');
        let kids = parseInt(d.kids);
  
        pr.forEach((n) => {
          nameP = namesArr.find((i, value) => parseInt(value) === parseInt(n)); // match id with parent name
          sankeydata.nodes.push({ name: nameP, });
  
          ch.forEach((n, i) => {
            nameC = namesArr.find((i, value) => parseInt(value) === parseInt(n));
            sankeydata.nodes.push({ name: nameC });
            sankeydata.links.push({
              source: nameP,
              target: nameC,
              value: 1,
              kids: kids,
            });
          });
        });
      }
    });

    // get all people in db that are not connected
    getUnlinkedPeopleData = (() => {
      // array of found names in parent/children relation
      /* prettier-ignore */
      let namesFound = [...new Set(sankeydata.nodes.map((item) => item.name))]; // return only the distinct / unique nodes

      //let sortedN = namesFound.sort((a, b) => a.id - b.id); // sorted by number
      /* prettier-ignore */
      sankeydata.unlinked = namesArr.filter((e) => !namesFound.find((a) => e.id === a.id)).slice(1); // remove first item

      // console.log(missing);
    })();

    ////////////////////////////////////////
    ////////////////////////////////////////

    // make array of children and remove empty strings from array
    let childrenArr = Array.from(data, (d) => d.children).filter((n) => n);
    arri = Array.from(childrenArr, (d) => JSON.parse('[' + d + ']')); // make array of arrays of values from strings

    sankeydata.nodes = [...new Set(sankeydata.nodes.map((d) => d.name))]; // return only the distinct / unique nodes,

    // loop through each link replacing the text with its index from node
    sankeydata.links.forEach((d, i) => {
      d.source = sankeydata.nodes.indexOf(sankeydata.links[i].source);
      d.target = sankeydata.nodes.indexOf(sankeydata.links[i].target);
    });

    // now loop through each nodes to make nodes an array of objects
    sankeydata.nodes.forEach(
      (d, i) =>
        (sankeydata.nodes[i] = {
          name: d.name,
          id: d.id,
          fixedlayer: d.fixedlayer,
          maritallastname: d.maritallastname,
          birthlastname: d.birthlastname,
          birthday: d.birthday,
          birthplace: d.birthplace,
          deathday: d.deathday,
          deathplace: d.deathplace,
          note: d.note,
        })
    );
  }

  const loadFamilyTree = function (Graph) {
    fetch('./data/fd1.csv')
      .then((r) => r.text())
      .then(d3.csvParse)
      .then((data) => {
        console.log(data);
        const nodes = [],
          links = [];
        data.forEach(({ size, path }) => {
          const levels = path.split('/'),
            module = levels.length > 1 ? levels[1] : null,
            leaf = levels.pop(),
            parent = levels.join('/');

          nodes.push({
            path,
            leaf,
            module,
            size: +size || 1,
          });

          if (parent) {
            links.push({ source: parent, target: path });
          }
        });

        Graph.nodeRelSize(0.5)
          .nodeId('path')
          .nodeVal('size')
          .nodeLabel('path')
          .nodeAutoColorBy('module')
          .graphData({ nodes, links });

        console.log('nodes: ', nodes);
        console.log('links: ', links);
      });
  };

  loadFamilyTree.description = '<em>My Family tree</em> data';

  //
  return [loadFamilyTree, loadD3Dependencies]; /*loadMiserables, loadBlocks,*/
}
