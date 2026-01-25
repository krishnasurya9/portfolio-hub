const fs = require('fs');
const path = require('path');

// Mock DOM environment to load data.js
global.document = {};
const dataFile = fs.readFileSync('./js/data.js', 'utf8');

// extracting the array manually since require wouldn't work easily with the const declaration in browser-side JS
// We'll use a simple eval context or regex to parse it for this test
let teamMembers = [];
try {
    // Quick hack to evaluate the file content to get the variable
    // This is safe here because we own the file
    eval(dataFile);
} catch (e) {
    console.error("❌ Failed to parse js/data.js:", e.message);
    process.exit(1);
}

console.log(`ℹ️  Found ${teamMembers.length} team members.`);

let errors = 0;

teamMembers.forEach(member => {
    console.log(`\nTesting Member: ${member.name} (${member.id})`);

    // 1. Check Image Access
    const imgPath = path.join(__dirname, member.image);
    if (fs.existsSync(imgPath)) {
        console.log(`   ✅ Image found: ${member.image}`);
    } else {
        console.error(`   ❌ Image MISSING: ${member.image}`);
        errors++;
    }

    // 2. Check Portfolio Link Access
    const linkPath = path.join(__dirname, member.link);
    if (fs.existsSync(linkPath)) {
        console.log(`   ✅ Portfolio Page found: ${member.link}`);
    } else {
        console.error(`   ❌ Portfolio Page MISSING: ${member.link}`);
        errors++;
    }
});

// 3. Check Global Assets
const globalAssets = [
    'css/main.css',
    'css/landing.css',
    'css/responsive.css',
    'js/app.js',
    'assets/documents/resume.pdf'
];

console.log('\nTesting Global Assets:');
globalAssets.forEach(asset => {
    if (fs.existsSync(path.join(__dirname, asset))) {
        console.log(`   ✅ Asset found: ${asset}`);
    } else {
        console.error(`   ❌ Asset MISSING: ${asset}`);
        errors++;
    }
});

console.log('\n-------------------');
if (errors === 0) {
    console.log('✅ TEST PASSED: All links and assets valid.');
    process.exit(0);
} else {
    console.error(`❌ TEST FAILED: ${errors} errors found.`);
    process.exit(1);
}
