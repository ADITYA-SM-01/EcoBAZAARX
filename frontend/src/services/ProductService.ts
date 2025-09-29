const API_URL = "http://localhost:8090/api/products";

export async function fetchAllProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function fetchProductById(id: number) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}

export async function addProduct(product: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error("Failed to add product");
  return response.json();
}

export async function updateProduct(id: number, product: any) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return true;
}
