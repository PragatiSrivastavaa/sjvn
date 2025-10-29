/**
 * Accessibility Widget Test & Debug Script
 * Run this in browser console to diagnose issues
 */

(function() {
  console.log('🔍 ===== ACCESSIBILITY WIDGET DIAGNOSTIC =====\n');
  
  // 1. Check if elements exist
  console.log('1️⃣ CHECKING ELEMENTS:');
  const trigger = document.getElementById('accessibility-trigger');
  const drawer = document.getElementById('accessibility-drawer');
  const overlay = document.getElementById('accessibility-overlay');
  
  console.log('   ✓ Trigger button:', !!trigger);
  console.log('   ✓ Drawer:', !!drawer);
  console.log('   ✓ Overlay:', !!overlay);
  
  if (!drawer) {
    console.error('   ❌ DRAWER NOT FOUND! Cannot continue.');
    return;
  }
  
  // 2. Check if drawer is open
  console.log('\n2️⃣ CHECKING DRAWER STATE:');
  console.log('   Drawer has "open" class:', drawer.classList.contains('open'));
  console.log('   Drawer computed right:', window.getComputedStyle(drawer).right);
  
  if (!drawer.classList.contains('open')) {
    console.log('   ℹ️ Opening drawer...');
    drawer.classList.add('open');
    overlay.classList.add('active');
    drawer.style.right = '0';
  }
  
  // 3. Check text size buttons
  console.log('\n3️⃣ CHECKING TEXT SIZE BUTTONS:');
  const textButtons = drawer.querySelectorAll('[data-action^="text-"]');
  console.log('   Found', textButtons.length, 'text size buttons');
  
  textButtons.forEach(btn => {
    const action = btn.getAttribute('data-action');
    const hasActive = btn.classList.contains('active');
    console.log('   -', action, '→ active:', hasActive);
  });
  
  // 4. Test clicking A+ button
  console.log('\n4️⃣ TESTING A+ BUTTON CLICK:');
  const aPlusBtn = drawer.querySelector('[data-action="text-increase"]');
  if (aPlusBtn) {
    console.log('   Found A+ button, clicking it...');
    
    // Remove all active first
    textButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active to A+
    aPlusBtn.classList.add('active');
    
    // Add class to body
    document.body.classList.add('a11y-text-increase');
    
    setTimeout(() => {
      console.log('   After click:');
      console.log('   - A+ has active class:', aPlusBtn.classList.contains('active'));
      console.log('   - Body has a11y-text-increase:', document.body.classList.contains('a11y-text-increase'));
      console.log('   - A+ background color:', window.getComputedStyle(aPlusBtn).backgroundColor);
      console.log('   - Body font size:', window.getComputedStyle(document.body).fontSize);
      
      // Check if text actually changed
      const testP = document.querySelector('p');
      if (testP) {
        console.log('   - Sample paragraph font:', window.getComputedStyle(testP).fontSize);
      }
      
      console.log('\n   👀 Look at the page:');
      console.log('   - Is A+ button BLUE?');
      console.log('   - Is text BIGGER on page?');
    }, 500);
  }
  
  // 5. Check CSS loaded
  console.log('\n5️⃣ CHECKING CSS:');
  const cssLoaded = Array.from(document.styleSheets).some(s => 
    s.href && s.href.includes('accessibility.css')
  );
  console.log('   accessibility.css loaded:', cssLoaded);
  
  if (cssLoaded) {
    console.log('   ✅ CSS is loaded');
  } else {
    console.error('   ❌ CSS NOT LOADED! This is the problem!');
  }
  
  // 6. Check if JavaScript API exists
  console.log('\n6️⃣ CHECKING JAVASCRIPT:');
  console.log('   SJVNAccessibility exists:', typeof SJVNAccessibility !== 'undefined');
  console.log('   Drupal exists:', typeof Drupal !== 'undefined');
  
  // 7. Force test
  console.log('\n7️⃣ FORCE TEST (making changes manually):');
  console.log('   Setting body font size to 24px...');
  document.body.style.fontSize = '24px';
  
  setTimeout(() => {
    console.log('   Did text get bigger? (Should be VERY obvious)');
    console.log('   Current body fontSize:', window.getComputedStyle(document.body).fontSize);
    
    // Reset
    document.body.style.fontSize = '';
    document.body.classList.remove('a11y-text-increase');
    
    console.log('\n   Reset to normal.');
  }, 2000);
  
  console.log('\n✅ ===== DIAGNOSTIC COMPLETE =====');
  console.log('\nNEXT STEPS:');
  console.log('1. Check if A+ button turned BLUE');
  console.log('2. Check if text got bigger when fontSize was set to 24px');
  console.log('3. Report results in console');
  
})();

