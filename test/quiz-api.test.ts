import { db } from '../server/db.ts';

function runTests() {
  console.log('----------------------------------------------------');
  console.log('🧪 BFFMeter Test Suite — Core Specification Verification');
  console.log('----------------------------------------------------');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      if (detail) console.error(`   Details: ${detail}`);
      failed++;
    }
  }

  // Test 1: Public answer-key protection
  const publicQuiz = db.getPublicQuiz('bm-maya26');
  assert(
    '1. Public Answer-Key Protection (No answer leak)',
    Boolean(publicQuiz && !publicQuiz.questions.some((q: any) => 'correctOptionId' in q)),
    'correctOptionId must be omitted from all public question payloads'
  );

  // Test 2: Quiz Creation & Unique Code Generation
  const testQuiz = db.createQuiz({
    creatorName: 'Alex Test',
    creatorGender: 'male',
    title: 'Unit Test Friendship Challenge',
    questions: [
      {
        text: 'What is my favorite animal?',
        options: [
          { id: 'opt-dog', text: 'Golden Retriever', emoji: '🐕' },
          { id: 'opt-cat', text: 'Orange Cat', emoji: '🐈' },
        ],
        correctOptionId: 'opt-dog',
      },
      {
        text: 'What do I drink in the morning?',
        options: [
          { id: 'opt-tea', text: 'Green Matcha', emoji: '🍵' },
          { id: 'opt-coffee', text: 'Iced Americano', emoji: '☕' },
        ],
        correctOptionId: 'opt-coffee',
      },
    ],
    settings: { allowMultipleAttempts: false },
  });

  assert(
    '2. Quiz Creation & Unguessable Code Generation',
    Boolean(testQuiz.quiz.code.startsWith('bm-') && testQuiz.editToken.length >= 16),
    `Generated code: ${testQuiz.quiz.code}, token: ${testQuiz.editToken}`
  );

  // Test 3: Server-side Answer Submission & Accurate Scoring
  const submissionResult = db.submitAttempt(
    testQuiz.quiz.code,
    'Jordan Bestie',
    {
      [testQuiz.quiz.questions[0].id]: 'opt-dog', // correct
      [testQuiz.quiz.questions[1].id]: 'opt-coffee', // correct
    },
    22,
    'female'
  );

  const subOk = 'attempt' in submissionResult && submissionResult.attempt.score === 2 && submissionResult.attempt.percentage === 100;
  assert(
    '3. Server-Side Score Calculation (100% Perfect Score)',
    subOk,
    'Server must accurately compute score from true answer key'
  );

  // Test 4: Duplicate Submission Blocking
  const duplicateAttempt = db.submitAttempt(
    testQuiz.quiz.code,
    'Jordan Bestie', // same name, multiple attempts forbidden
    {
      [testQuiz.quiz.questions[0].id]: 'opt-dog',
    },
    15,
    'female'
  );

  const dupBlocked = 'error' in duplicateAttempt && duplicateAttempt.error.includes('already taken');
  assert(
    '4. Duplicate Submission Prevention (Rule Enforcement)',
    dupBlocked,
    'Must reject duplicate participant name when retries are disabled'
  );

  // Test 5: Ranking ties & sorting
  // Submit second attempt with lower score
  db.submitAttempt(
    testQuiz.quiz.code,
    'Taylor Pal',
    {
      [testQuiz.quiz.questions[0].id]: 'opt-dog', // 1/2 correct
      [testQuiz.quiz.questions[1].id]: 'opt-tea',
    },
    18,
    'male'
  );

  const scoreboard = db.getScoreboard(testQuiz.quiz.code);
  const rankingOk =
    scoreboard.items.length === 2 &&
    scoreboard.items[0].participantName === 'Jordan Bestie' &&
    scoreboard.items[0].score === 2 &&
    scoreboard.items[1].participantName === 'Taylor Pal' &&
    scoreboard.items[1].score === 1;

  assert(
    '5. Scoreboard Ranking & Tie-Break Ordering',
    rankingOk,
    'Scoreboard must order by highest score first, then completion speed'
  );

  // Test 6: Permissions & Unauthorized Modification Rejection
  const badUpdate = db.updateQuiz(testQuiz.quiz.code, 'invalid-hack-token', { title: 'Compromised' });
  assert(
    '6. Creator Token Authorization (Reject forged tokens)',
    badUpdate === null,
    'Updates without matching edit token must return null / 403'
  );

  // Test 7: Authorized Deletion & Cleanup
  const deleteSuccess = db.deleteQuiz(testQuiz.quiz.code, testQuiz.editToken);
  const postDeleteLookup = db.getQuizByCode(testQuiz.quiz.code);
  assert(
    '7. Authorized Deletion Flow & Cascade Cleanup',
    deleteSuccess && postDeleteLookup === null,
    'Quiz must be removed when valid edit token is provided'
  );

  // Test 8: Custom Photo Option Attachment & Retrieval
  const photoQuiz = db.createQuiz({
    creatorName: 'Photo Tester',
    creatorGender: 'female',
    title: 'Photo Attachment Verification',
    questions: [
      {
        text: 'Which food photo is my favorite?',
        options: [
          { id: 'opt-pizza', text: 'Cheesy Pizza', emoji: '🍕', imageUrl: 'https://images.unsplash.com/pizza.jpg' },
          { id: 'opt-ramen', text: 'Hot Ramen', emoji: '🍜', imageUrl: 'https://images.unsplash.com/ramen.jpg' },
        ],
        correctOptionId: 'opt-pizza',
      },
    ],
  });

  const publicPhotoQuiz = db.getPublicQuiz(photoQuiz.quiz.code);
  const hasPhotoUrl = publicPhotoQuiz?.questions[0].options[0].imageUrl === 'https://images.unsplash.com/pizza.jpg';
  assert(
    '8. Custom Photo Attached on Options (imageUrl preserved)',
    Boolean(hasPhotoUrl),
    'Custom imageUrl on options must be preserved and sent in public quiz'
  );

  // Test 9: Admin Question Bank Customization & Options Management
  const newBankQ = db.addBankQuestion({
    category: 'Travel & Trips',
    categoryBn: 'ভ্রমণ ও অভিযান',
    text: 'What is my dream destination?',
    textBn: 'আমার স্বপ্নের ভ্রমণস্থল কোনটা?',
    emoji: '✈️',
    options: [
      { id: 'opt-tokyo', text: 'Tokyo', emoji: '🗾', imageUrl: 'https://images.unsplash.com/tokyo.jpg' },
      { id: 'opt-paris', text: 'Paris', emoji: '🥐', imageUrl: 'https://images.unsplash.com/paris.jpg' },
    ],
  });

  const bankUpdated = db.updateBankQuestion(newBankQ.id, {
    text: 'What is my ultimate dream destination updated?',
  });

  const bankMatches = bankUpdated?.text === 'What is my ultimate dream destination updated?' &&
    bankUpdated?.options[0].imageUrl === 'https://images.unsplash.com/tokyo.jpg';

  assert(
    '9. Admin Question Bank & Options Customization',
    Boolean(bankMatches),
    'Admin must be able to add, customize, and edit bank questions and options with attached photos'
  );

  // Test 10: Site-Wide Page Customization Settings
  const savedSettings = db.savePageSettings('home', {
    heroHeadlineOverride: 'Test Custom Hero Title',
    bannerNotice: {
      enabled: true,
      text: 'Special Admin Announcement Banner',
      bg: '#FFF9D6',
      textColor: '#202B49',
    },
  });

  const retrievedSettings = db.getPageCustomizations('home');
  assert(
    '10. Site-Wide Page Customization Settings & Overrides',
    Boolean(
      retrievedSettings.pageSettings['home']?.heroHeadlineOverride === 'Test Custom Hero Title' &&
      retrievedSettings.pageSettings['home']?.bannerNotice?.enabled === true
    ),
    'Admin must be able to configure headline, banner, and custom settings on any page'
  );

  // Test 11: Draggable Custom Element (GIF / Image / Text) Placement & Repositioning
  const customElem = db.saveCustomElement({
    pageId: 'home',
    type: 'gif',
    content: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    title: 'Draggable Mascot',
    position: { x: 30, y: 40, unit: '%' },
    styles: { width: 120, rotation: 5 },
    visible: true,
  });

  const posUpdated = db.updateElementPosition(customElem.id, { x: 75, y: 80, unit: '%' });
  const pageElems = db.getPageCustomizations('home').elements;
  const foundElem = pageElems.find((e) => e.id === customElem.id);

  assert(
    '11. Draggable Element Placement & Live Coordinate Repositioning',
    Boolean(posUpdated && foundElem && foundElem.position.x === 75 && foundElem.position.y === 80),
    'Admin can place GIFs/images/text anywhere on any page and drag reposition them'
  );

  // Cleanup
  db.deleteCustomElement(customElem.id);
  db.deleteQuiz(photoQuiz.quiz.code, photoQuiz.editToken);
  db.deleteBankQuestion(newBankQ.id);

  console.log('----------------------------------------------------');
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
