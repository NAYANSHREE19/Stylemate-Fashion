import { resolveUserGender } from './genderFilterService.js';

const maleQuestions = [
  {
    id: 'fit-preference',
    question: 'Which fit do you prefer most?',
    type: 'single',
    options: ['Slim', 'Regular', 'Oversized']
  },
  {
    id: 'footwear-choice',
    question: 'For daily style, what do you prefer?',
    type: 'single',
    options: ['Sneakers', 'Loafers']
  },
  {
    id: 'upperwear-choice',
    question: 'Choose your go-to top wear:',
    type: 'single',
    options: ['Shirt', 'T-shirt', 'Jacket']
  }
];

const femaleQuestions = [
  {
    id: 'outfit-base',
    question: 'Which do you prefer more?',
    type: 'single',
    options: ['Dresses', 'Jeans']
  },
  {
    id: 'footwear-choice',
    question: 'For most occasions, what do you prefer?',
    type: 'single',
    options: ['Heels', 'Flats']
  },
  {
    id: 'style-direction',
    question: 'Pick your preferred vibe:',
    type: 'single',
    options: ['Ethnic', 'Western', 'Fusion']
  }
];

export const getGenderedQuizQuestions = (user) => {
  const gender = resolveUserGender(user);
  return gender === 'male' ? maleQuestions : femaleQuestions;
};
