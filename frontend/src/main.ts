document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput") as HTMLInputElement;
  const button = document.getElementById("scrapeButton") as HTMLButtonElement;
  const resultDiv = document.getElementById("result") as HTMLDivElement;

  button.addEventListener("click", async () => {
    const keyword = input.value.trim();
    if (!keyword) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(
          keyword
        )}`
      );
      const data: {
        title: string;
        price: string;
        link: string;
        image: string;
      }[] = await response.json();
      resultDiv.innerHTML = "<h2>Results:</h2>";
      data.forEach((product) => {
        resultDiv.innerHTML += `
        <div>
          <h3>${product.title}</h3>
          <p>Price: ${product.price}</p>
          <p>Link: <a href="${product.link}" target="_blank">${product.link}</a></p>
          <img src="${product.image}" alt="Products Image"  style="width: 100px; height: auto;">
        </div>
        `;
      });
    } catch (error) {
      resultDiv.innerHTML = "<p>Error fetching data. Please try again.</p>";
    }
  });
});
