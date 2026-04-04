// reservation.js
// 予約フォームの送信処理

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxsFV5zlVxIw9c6Ec-WvwHZXxbPsxXnTxxpGTae9oSs66QcGvFIYR1Kyyh8ZR9sqP6I/exec';

// エラー表示ヘルパー
function showError(fieldEl, msg) {
  fieldEl.classList.add('is-error');
  let err = fieldEl.parentElement.querySelector('.rsv-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'rsv-error';
    fieldEl.after(err);
  }
  err.textContent = msg;
}

function clearError(fieldEl) {
  fieldEl.classList.remove('is-error');
  const err = fieldEl.parentElement.querySelector('.rsv-error');
  if (err) err.textContent = '';
}

// リアルタイムバリデーション（フォーカスが外れたとき）
document.addEventListener('DOMContentLoaded', function() {
  var nameEl  = document.querySelector('input[name="name"]');
  var emailEl = document.querySelector('input[name="email"]');

  if (nameEl) {
    nameEl.addEventListener('blur', function() {
      if (!nameEl.value.trim()) {
        showError(nameEl, 'お名前を入力してください');
      } else {
        clearError(nameEl);
      }
    });
  }

  if (emailEl) {
    emailEl.addEventListener('blur', function() {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailEl.value.trim()) {
        showError(emailEl, 'メールアドレスを入力してください');
      } else if (!re.test(emailEl.value)) {
        showError(emailEl, '正しいメールアドレスの形式で入力してください');
      } else {
        clearError(emailEl);
      }
    });
  }
});

function handleSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  var form      = document.querySelector('.rsv-form');
  var nameEl    = form.querySelector('input[name="name"]');
  var emailEl   = form.querySelector('input[name="email"]');
  var agreePrivacy = document.getElementById('agreePrivacy');
  var agreeTerms   = document.getElementById('agreeTerms');
  var agreeError   = document.getElementById('agreeError');

  var hasError = false;
  var firstErrorEl = null;
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 名前チェック
  if (!nameEl.value.trim()) {
    showError(nameEl, 'お名前を入力してください');
    if (!firstErrorEl) firstErrorEl = nameEl;
    hasError = true;
  } else {
    clearError(nameEl);
  }

  // メールチェック
  if (!emailEl.value.trim()) {
    showError(emailEl, 'メールアドレスを入力してください');
    if (!firstErrorEl) firstErrorEl = emailEl;
    hasError = true;
  } else if (!re.test(emailEl.value)) {
    showError(emailEl, '正しいメールアドレスの形式で入力してください');
    if (!firstErrorEl) firstErrorEl = emailEl;
    hasError = true;
  } else {
    clearError(emailEl);
  }

  // 同意チェック
  if (agreeError) {
    if (!agreePrivacy.checked || !agreeTerms.checked) {
      agreeError.textContent = '同意事項にチェックをしてください';
      if (!firstErrorEl) firstErrorEl = agreePrivacy;
      hasError = true;
    } else {
      agreeError.textContent = '';
    }
  }

  // 最初のエラー箇所にスクロール
  if (hasError) {
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return false;
  }

  // 入力データ取得
  var data = {
    name: nameEl.value,
    email: emailEl.value,
    date: form.querySelector('select[name="date"]').value,
    companions: form.querySelector('select[name="companions"]').value,
    events: Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
      .map(function(cb) { return cb.value; })
      .filter(function(v) { return v !== 'mail' && v !== 'on'; })
      .join('、'),
    newsletter: form.querySelector('input[value="mail"]') &&
                form.querySelector('input[value="mail"]').checked ? 'はい' : 'いいえ'
  };

  // 送信ボタンを無効化
  var btn = document.querySelector('.rsv-submit');
  btn.textContent = '送信中...';
  btn.disabled = true;

  // GASにデータを送信
  fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function() {
    window.location.href = 'thanks.html';
  })
  .catch(function() {
    alert('送信に失敗しました。もう一度お試しください。');
    btn.textContent = '予約を確定する →';
    btn.disabled = false;
  });

  return false;
}
