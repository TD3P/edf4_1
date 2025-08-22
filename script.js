// 兵科カテゴリを開閉
function toggleClassCategory(headerElement) {
  debugLog('兵科カテゴリ開閉');
  
  const classCategoryElement = headerElement.parentElement;
  const isCollapsed = classCategoryElement.classList.contains('collapsed');
  
  if (isCollapsed) {
    // 開く
    classCategoryElement.classList.remove('collapsed');
  } else {
    // 閉じる
    classCategoryElement.classList.add('collapsed');
  }
}

// アコーディオンでカテゴリを開閉
function toggleCategory(headerElement) {
  debugLog('カテゴリ開閉');
  
  const categoryElement = headerElement.parentElement;
  const isCollapsed = categoryElement.classList.contains('collapsed');
  
  if (isCollapsed) {
    // 開く
    categoryElement.classList.remove('collapsed');
  } else {
    // 閉じる
    categoryElement.classList.add('collapsed');
  }
}

// 全カテゴリを開く
function expandAllCategories() {
  document.querySelectorAll('.class-category').forEach(classCategory => {
    classCategory.classList.remove('collapsed');
  });
  document.querySelectorAll('.weapon-category').forEach(category => {
    category.classList.remove('collapsed');
  });
  debugLog('全カテゴリを展開');
}

// 全カテゴリを閉じる
function collapseAllCategories() {
  document.querySelectorAll('.class-category').forEach(classCategory => {
    classCategory.classList.add('collapsed');
  });
  document.querySelectorAll('.weapon-category').forEach(category => {
    category.classList.add('collapsed');
  });
  debugLog('全カテゴリを折りたたみ');
}

// 武器データを格納する変数
let weaponData = {};
let currentClass = "all";
let checkedWeapons = new Set();

// デバッグ用ログ関数
function debugLog(message, data = null) {
  console.log(`[EDF4.1 Debug] ${message}`, data || "");
}

// 武器データをJSONPスタイルで読み込み（CORS回避）
async function loadWeaponData() {
  debugLog("武器データの読み込み開始");

  try {
    // まずfetchを試行
    if (window.location.protocol !== "file:") {
      const response = await fetch("./weaponData.json");
      if (response.ok) {
        const data = await response.json();
        weaponData = data;
        debugLog("武器データの読み込み成功（HTTP）", Object.keys(weaponData));
        return true;
      }
    }

    // file://プロトコルまたはfetch失敗時の処理
    throw new Error("HTTP server required for JSON loading");
  } catch (error) {
    debugLog("JSONファイル読み込み失敗", error.message);

    // JSONPスタイルでの読み込みを試行
    return await loadWeaponDataJSONP();
  }
}

// JSONPスタイルでの武器データ読み込み
function loadWeaponDataJSONP() {
  return new Promise((resolve) => {
    debugLog("JSONPスタイルでの読み込みを試行");

    // weaponData.jsファイルを動的に読み込み
    const script = document.createElement("script");
    script.src = "./weaponData.js";
    script.onload = () => {
      if (window.WEAPON_DATA) {
        weaponData = window.WEAPON_DATA;
        debugLog("武器データの読み込み成功（JSONP）", Object.keys(weaponData));
        resolve(true);
      } else {
        debugLog("JSONP読み込み失敗、フォールバックデータを使用");
        loadFallbackData();
        resolve(false);
      }
    };
    script.onerror = () => {
      debugLog("weaponData.jsが見つかりません、フォールバックデータを使用");
      loadFallbackData();
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

// フォールバックデータの読み込み
function loadFallbackData() {
  weaponData = {
    ranger: {
      name: "レンジャー",
      categories: {
        アサルトライフル: [
          { name: "AF14", level: 0 },
          { name: "AF15", level: 7 },
          { name: "AF16", level: 12 },
          { name: "AF17", level: 18 },
          { name: "AF18", level: 23 },
          { name: "AF19", level: 32 },
          { name: "AF20", level: 46 },
          { name: "AF99", level: 64 },
          { name: "AF100", level: 75 },
        ],
        ショットガン: [
          { name: "バッファローG1", level: 0 },
          { name: "バッファローG2", level: 3 },
          { name: "ガバナー25", level: 8 },
          { name: "ワイドショット", level: 11 },
        ],
        スナイパーライフル: [
          { name: "MMF40", level: 0 },
          { name: "ストリンガー", level: 4 },
          { name: "ライサンダー", level: 13 },
          { name: "ノヴァバスター", level: 18 },
        ],
      },
    },
    "wing-diver": {
      name: "ウイングダイバー",
      categories: {
        レーザーランス: [
          { name: "レーザーランス", level: 0 },
          { name: "レイピア", level: 12 },
          { name: "グングニル", level: 92 },
        ],
      },
    },
  };

  debugLog("フォールバックデータを使用");
}

// ローカルストレージから保存データを読み込み
function loadSavedData() {
  debugLog("保存データの読み込み開始");

  try {
    const saved = localStorage.getItem("edf41-weapons");
    if (saved) {
      checkedWeapons = new Set(JSON.parse(saved));
      debugLog("保存データの読み込み成功", checkedWeapons.size + "件");
    } else {
      debugLog("保存データなし");
    }
  } catch (error) {
    debugLog("保存データの読み込み失敗", error.message);
    checkedWeapons = new Set();
  }
}

// データをローカルストレージに保存
function saveData() {
  try {
    localStorage.setItem("edf41-weapons", JSON.stringify([...checkedWeapons]));
    debugLog("データ保存成功");
  } catch (error) {
    debugLog("データ保存失敗", error.message);
  }
}

// 武器リストを表示
function renderWeapons() {
  debugLog("武器リスト描画開始");

  const weaponListEl = document.getElementById("weaponList");
  if (!weaponListEl) {
    debugLog("weaponList要素が見つかりません");
    return;
  }

  // データがない場合の処理
  if (!weaponData || Object.keys(weaponData).length === 0) {
    weaponListEl.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #666; background: white; border-radius: 10px; margin: 20px;">
                <h3>🔄 武器データを読み込み中...</h3>
                <p>データの読み込みに失敗した場合は、ページを再読み込みしてください。</p>
            </div>
        `;
    return;
  }

  let totalCount = 0;
  let checkedCount = 0;
  let htmlContent = "";

  Object.keys(weaponData).forEach((classKey) => {
    if (currentClass !== "all" && currentClass !== classKey) return;

    const classData = weaponData[classKey];
    if (!classData || !classData.categories) return;

    // 兵科の大カテゴリヘッダー
    htmlContent += `
      <div class="class-category">
        <div class="class-header" onclick="toggleClassCategory(this)">
          <span class="class-title">${classData.name}</span>
          <span class="class-arrow">▼</span>
        </div>
        <div class="class-content">
    `;

    Object.keys(classData.categories).forEach((categoryKey) => {
      const weapons = classData.categories[categoryKey];
      if (!Array.isArray(weapons)) return;

      // 武器カテゴリヘッダー（小カテゴリ）
      htmlContent += `
        <div class="weapon-category">
          <div class="category-header" onclick="toggleCategory(this)">
            <span class="category-title">${categoryKey}</span>
            <span class="category-arrow">▼</span>
          </div>
          <div class="weapon-grid">
      `;

      // 武器アイテム
      weapons.forEach((weapon) => {
        // 武器データが文字列かオブジェクトかを判定
        const weaponName = typeof weapon === "string" ? weapon : weapon.name;
        const weaponLevel =
          typeof weapon === "object" && weapon.level !== undefined
            ? weapon.level
            : "?";

        const weaponId = `${classKey}-${categoryKey}-${weaponName}`;
        const isChecked = checkedWeapons.has(weaponId);

        totalCount++;
        if (isChecked) checkedCount++;

        htmlContent += `
          <div class="weapon-item ${isChecked ? "checked" : ""}" 
               onclick="toggleWeapon('${weaponId}', this)"
               data-weapon-id="${weaponId}">
            <div class="weapon-name">${weaponName} <span class="weapon-level">Lv${weaponLevel}</span></div>
          </div>
        `;
      });

      htmlContent += `
          </div>
        </div>
      `;
    });

    // 兵科カテゴリの終了
    htmlContent += `
        </div>
      </div>
    `;
  });

  if (htmlContent === "") {
    htmlContent = `
            <div style="text-align: center; padding: 50px; color: #666;">
                <h3>📊 武器データがありません</h3>
                <p>選択した兵科に武器データがありません。</p>
            </div>
        `;
  }

  weaponListEl.innerHTML = htmlContent;
  updateStats(totalCount, checkedCount);

  debugLog(
    "武器リスト描画完了",
    `${totalCount}件中${checkedCount}件チェック済み`
  );
}

// 武器の取得状態を切り替え
function toggleWeapon(weaponId, element) {
  debugLog("武器切り替え", weaponId);

  if (checkedWeapons.has(weaponId)) {
    checkedWeapons.delete(weaponId);
    element.classList.remove("checked");
  } else {
    checkedWeapons.add(weaponId);
    element.classList.add("checked");
  }

  saveData();
  updateStats(); // 統計更新（フィルタ表示とグローバル進捗両方）
}

// 統計を更新（フィルタ表示用）
function updateStats(total = null, checked = null) {
  // 引数が提供されていない場合は現在のフィルタに基づいて計算
  if (total === null || checked === null) {
    total = 0;
    checked = 0;

    Object.keys(weaponData).forEach((classKey) => {
      if (currentClass !== "all" && currentClass !== classKey) return;

      const classData = weaponData[classKey];
      if (!classData?.categories) return;

      Object.keys(classData.categories).forEach((categoryKey) => {
        const weapons = classData.categories[categoryKey];
        if (!Array.isArray(weapons)) return;

        weapons.forEach((weapon) => {
          total++;
          const weaponName = typeof weapon === "string" ? weapon : weapon.name;
          const weaponId = `${classKey}-${categoryKey}-${weaponName}`;
          if (checkedWeapons.has(weaponId)) checked++;
        });
      });
    });
  }

  // 統計セクションの更新（現在のフィルタに基づく）
  const elements = {
    totalWeapons: document.getElementById("totalWeapons"),
    collectedWeapons: document.getElementById("collectedWeapons"),
    completionRate: document.getElementById("completionRate"),
  };

  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

  if (elements.totalWeapons) elements.totalWeapons.textContent = total;
  if (elements.collectedWeapons)
    elements.collectedWeapons.textContent = checked;
  if (elements.completionRate)
    elements.completionRate.textContent = `${percentage}%`;

  // ヘッダーの進捗バーは常に全体を表示
  updateGlobalStats();
}

// 全体の進捗を更新（ヘッダーのプログレスバー用）
function updateGlobalStats() {
  let globalTotal = 0;
  let globalChecked = 0;

  // 全武器データを対象に計算
  Object.keys(weaponData).forEach((classKey) => {
    const classData = weaponData[classKey];
    if (!classData?.categories) return;

    Object.keys(classData.categories).forEach((categoryKey) => {
      const weapons = classData.categories[categoryKey];
      if (!Array.isArray(weapons)) return;

      weapons.forEach((weapon) => {
        globalTotal++;
        const weaponName = typeof weapon === "string" ? weapon : weapon.name;
        const weaponId = `${classKey}-${categoryKey}-${weaponName}`;
        if (checkedWeapons.has(weaponId)) globalChecked++;
      });
    });
  });

  const globalPercentage =
    globalTotal > 0 ? Math.round((globalChecked / globalTotal) * 100) : 0;

  // ヘッダーのプログレスバー要素を更新
  const progressElements = {
    progressText: document.getElementById("progressText"),
    progressFill: document.getElementById("progressFill"),
  };

  if (progressElements.progressText) {
    progressElements.progressText.textContent = `${globalChecked} / ${globalTotal} 武器取得済み (${globalPercentage}%)`;
  }
  if (progressElements.progressFill) {
    progressElements.progressFill.style.width = `${globalPercentage}%`;
  }
}

// 兵科タブの切り替え
function switchClass(newClass) {
  debugLog("兵科切り替え", newClass);

  currentClass = newClass;

  // タブの状態更新
  document.querySelectorAll(".class-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  const activeTab = document.querySelector(`[data-class="${newClass}"]`);
  if (activeTab) {
    activeTab.classList.add("active");
  }

  renderWeapons();
}

// 武器データの統計を表示（デバッグ用）
function showWeaponStats() {
  if (!weaponData || Object.keys(weaponData).length === 0) {
    console.log("武器データが読み込まれていません");
    return;
  }

  let totalWeapons = 0;
  console.log("=== EDF4.1 武器統計 ===");

  Object.keys(weaponData).forEach((classKey) => {
    const classData = weaponData[classKey];
    let classTotal = 0;

    console.log(`\n${classData.name}:`);
    Object.keys(classData.categories).forEach((categoryKey) => {
      const weaponCount = classData.categories[categoryKey].length;
      classTotal += weaponCount;
      console.log(`  ${categoryKey}: ${weaponCount}種類`);
    });

    console.log(`  合計: ${classTotal}種類`);
    totalWeapons += classTotal;
  });

  console.log(`\n総武器数: ${totalWeapons}種類`);
  console.log(`チェック済み: ${checkedWeapons.size}種類`);
}

// イベントリスナーの設定
function setupEventListeners() {
  debugLog("イベントリスナー設定開始");

  // 兵科タブのクリック
  const classTabs = document.getElementById("classTabs");
  if (classTabs) {
    classTabs.addEventListener("click", (e) => {
      if (e.target.classList.contains("class-tab")) {
        switchClass(e.target.dataset.class);
      }
    });
    debugLog("兵科タブイベント設定完了");
  }
}

// DOM要素の存在確認
function checkDOMElements() {
  const requiredElements = [
    "weaponList",
    "classTabs",
    "totalWeapons",
    "collectedWeapons",
    "completionRate",
    "progressText",
    "progressFill",
  ];

  const missing = requiredElements.filter((id) => !document.getElementById(id));

  if (missing.length > 0) {
    debugLog("必要なDOM要素が見つかりません", missing);
    return false;
  }

  debugLog("DOM要素チェック完了");
  return true;
}

// 初期化処理
async function initialize() {
  debugLog("=== アプリケーション初期化開始 ===");

  try {
    // 1. DOM要素の確認
    if (!checkDOMElements()) {
      throw new Error("必要なDOM要素が見つかりません");
    }

    // 2. イベントリスナーを設定
    setupEventListeners();

    // 3. 保存されたデータを読み込み
    loadSavedData();

    // 4. 武器データを読み込み
    const loadSuccess = await loadWeaponData();

    if (loadSuccess) {
      debugLog("武器データの読み込み完了");
    } else {
      debugLog("フォールバックデータを使用");
    }

    // 5. 武器リストを表示
    renderWeapons();

    // 6. 統計を表示（デバッグ用）
    if (console && console.log) {
      setTimeout(showWeaponStats, 1000);
    }

    debugLog("=== 初期化完了 ===");
  } catch (error) {
    debugLog("初期化エラー", error.message);
    console.error("アプリケーション初期化エラー:", error);

    // エラー時の最小限表示
    const weaponListEl = document.getElementById("weaponList");
    if (weaponListEl) {
      weaponListEl.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #e74c3c; background: white; border-radius: 10px; margin: 20px;">
                    <h3>⚠️ エラーが発生しました</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #007acc; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ページを再読み込み
                    </button>
                </div>
            `;
    }
  }
}

// グローバル関数として公開（デバッグ用）
window.debugEDF = {
  showWeaponStats,
  weaponData: () => weaponData,
  checkedWeapons: () => checkedWeapons,
  renderWeapons,
  initialize,
  expandAllCategories,
  collapseAllCategories,
  toggleCategory,
  toggleClassCategory
};

// トップに戻るボタンの機能
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (!scrollToTopBtn) {
    debugLog("トップに戻るボタンが見つかりません");
    return;
  }

  // スクロール位置を監視してボタンの表示/非表示を切り替え
  function toggleScrollButton() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  }

  // スムーズスクロールでトップに戻る
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // イベントリスナーを追加
  window.addEventListener("scroll", toggleScrollButton);
  scrollToTopBtn.addEventListener("click", scrollToTop);

  // 初期状態を設定
  toggleScrollButton();

  debugLog("トップに戻るボタンを初期化しました");
}

// DOM読み込み完了後に初期化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initialize();
    initScrollToTop();
  });
} else {
  // 既にDOMが読み込まれている場合
  initialize();
  initScrollToTop();
}
