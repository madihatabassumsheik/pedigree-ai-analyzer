export function savePedigree(name, nodes, edges) {

  const pedigree = {
    name,
    nodes,
    edges,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    `pedigree_${name}`,
    JSON.stringify(pedigree)
  );
}

export function loadPedigree(name) {

  const data =
    localStorage.getItem(`pedigree_${name}`);

  if (!data) return null;

  return JSON.parse(data);
}

export function listPedigrees() {

  const keys = Object.keys(localStorage);

  return keys
    .filter((k) => k.startsWith("pedigree_"))
    .map((k) => k.replace("pedigree_", ""));
}