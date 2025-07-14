async function search() {
  const response = await fetch(`http://localhost:3000/api/search`);
  const data = await response.json();
  console.log('search results:', data);
}

search();