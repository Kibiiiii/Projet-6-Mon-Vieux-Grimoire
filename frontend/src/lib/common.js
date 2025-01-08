import axios from 'axios';
import { API_ROUTES } from '../utils/constants';

function formatBooks(bookArray) {
  return bookArray.map((book) => {
    const newBook = { ...book };
    // eslint-disable-next-line no-underscore-dangle
    newBook.id = newBook._id;
    return newBook;
  });
}

export function storeInLocalStorage(token, userId) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  console.log('Token et userId stockés dans le localStorage:', token, userId);
}

export function getFromLocalStorage(item) {
  const value = localStorage.getItem(item);
  console.log(`Valeur récupérée du localStorage pour ${item}:`, value);
  return value;
}

export async function getAuthenticatedUser() {
  const defaultReturnObject = { authenticated: false, user: null };
  try {
    const token = getFromLocalStorage('token');
    const userId = getFromLocalStorage('userId');
    if (!token) {
      console.log('Pas de token trouvé, utilisateur non authentifié');
      return defaultReturnObject;
    }
    console.log('Utilisateur authentifié, userId:', userId, 'token:', token);
    return { authenticated: true, user: { userId, token } };
  } catch (err) {
    console.error('getAuthenticatedUser, Something Went Wrong', err);
    return defaultReturnObject;
  }
}

export async function getBooks() {
  console.log('Tentative de récupération des livres');
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Pas de token, utilisateur non authentifié');
    return [];
  }

  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BOOKS}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Réponse de l\'API pour la récupération des livres:', response);
    const books = formatBooks(response.data);
    console.log('Livres formatés:', books);
    return books;
  } catch (err) {
    console.error('Erreur lors de la récupération des livres:', err);
    return [];
  }
}

export async function getBook(id) {
  console.log(`Tentative de récupération du livre avec l'id: ${id}`);
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BOOKS}/${id}`,
    });
    const book = response.data;
    // eslint-disable-next-line no-underscore-dangle
    book.id = book._id;
    console.log('Livre récupéré:', book);
    return book;
  } catch (err) {
    console.error('Erreur lors de la récupération du livre:', err);
    return null;
  }
}

export async function getBestRatedBooks() {
  console.log('Tentative de récupération des livres les mieux notés');
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BEST_RATED}`,
    });
    const bestRatedBooks = formatBooks(response.data);
    console.log('Livres les mieux notés:', bestRatedBooks);
    return bestRatedBooks;
  } catch (e) {
    console.error('Erreur lors de la récupération des livres les mieux notés:', e);
    return [];
  }
}

export async function deleteBook(id) {
  console.log(`Tentative de suppression du livre avec l'id: ${id}`);
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Pas de token, utilisateur non authentifié');
    return false;
  }

  try {
    await axios.delete(`${API_ROUTES.BOOKS}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`Livre avec l'id: ${id} supprimé avec succès`);
    return true;
  } catch (err) {
    console.error('Erreur lors de la suppression du livre:', err);
    return false;
  }
}

export async function rateBook(id, userId, rating) {
  console.log(`Tentative de notation du livre avec l'id: ${id}, note: ${rating}`);
  const data = {
    userId,
    rating: parseInt(rating, 10),
  };

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Pas de token, utilisateur non authentifié');
    return null;
  }

  try {
    const response = await axios.post(`${API_ROUTES.BOOKS}/${id}/rating`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const book = response.data;
    // eslint-disable-next-line no-underscore-dangle
    book.id = book._id;
    console.log('Réponse de l\'API après notation du livre:', book);
    return book;
  } catch (e) {
    console.error('Erreur lors de la notation du livre:', e);
    return e.message;
  }
}

export async function addBook(data) {
  console.log('Tentative d\'ajout d\'un nouveau livre avec les données:', data);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (!token || !userId) {
    console.error('Pas de token ou userId, utilisateur non authentifié');
    return { error: true, message: 'Utilisateur non authentifié' };
  }

  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: data.year,
    genre: data.genre,
    ratings: [{
      userId,
      grade: data.rating ? parseInt(data.rating, 10) : 0,
    }],
    averageRating: parseInt(data.rating, 10),
  };

  const bodyFormData = new FormData();
  bodyFormData.append('book', JSON.stringify(book));
  bodyFormData.append('image', data.file[0]);

  try {
    console.log('Envoi de la requête pour ajouter un livre...');
    const response = await axios({
      method: 'post',
      url: `${API_ROUTES.BOOKS}`,
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Réponse de l\'API après ajout du livre:', response);
    return response;
  } catch (err) {
    console.error('Erreur lors de l\'ajout du livre:', err);
    return { error: true, message: err.message };
  }
}

export async function updateBook(data, id) {
  console.log(`Tentative de mise à jour du livre avec l'id: ${id} et les données:`, data);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (!token || !userId) {
    console.error('Pas de token ou userId, utilisateur non authentifié');
    return { error: true, message: 'Utilisateur non authentifié' };
  }

  let newData;
  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: data.year,
    genre: data.genre,
  };

  console.log('Image associée au livre:', data.file[0]);
  if (data.file[0]) {
    newData = new FormData();
    newData.append('book', JSON.stringify(book));
    newData.append('image', data.file[0]);
  } else {
    newData = { ...book };
  }

  try {
    console.log('Envoi de la requête pour mettre à jour le livre...');
    const newBook = await axios({
      method: 'put',
      url: `${API_ROUTES.BOOKS}/${id}`,
      data: newData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Réponse de l\'API après mise à jour du livre:', newBook);
    return newBook;
  } catch (err) {
    console.error('Erreur lors de la mise à jour du livre:', err);
    return { error: true, message: err.message };
  }
}
