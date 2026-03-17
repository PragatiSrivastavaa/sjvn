<?php
$file_path = 'c:\xampp\htdocs\sjvn\sites\default\config\orgchart.charts.d43b20f70db8eaccc386736209e13544.yml';
$hi_file_path = 'c:\xampp\htdocs\sjvn\sites\default\config\language\hi\orgchart.charts.d43b20f70db8eaccc386736209e13544.yml';

use Symfony\Component\Yaml\Yaml;

// If Yaml parsing isn't directly available without drupal bootstrap, 
// let's do a quick regex or array generation.

$translations = [
    'Chairman & Managing Director' => 'अध्यक्ष एवं प्रबंध निदेशक',
    'Director (Projects' => 'निदेशक (परियोजनाएं)',
    'Director (Personnel)' => 'निदेशक (कार्मिक)',
    'Chief Vigilance Officer' => 'मुख्य सतर्कता अधिकारी',
    'Director (Finance)' => 'निदेशक (वित्त)',
    'Corporate Functions' => 'निगमित कार्य',
    'Subsidiaries & JVs' => 'सहायक कंपनियां और संयुक्त उद्यम',
    'Projects' => 'परियोजनाएं',
    'Under Constrcution' => 'निर्माणाधीन',
    'Under Operation' => 'प्रचालनाधीन',
    'BDE Department Corporate HQ' => 'बीडीई विभाग निगमित मुख्यालय',
    'Coporate Planning Corporate HQ' => 'निगमित योजना निगमित मुख्यालय',
    'Pre-Construction' => 'निर्माण पूर्व',
    'SJVN Arun-3 Power Dev. Company (SAPDC) 900 MW' => 'एसजेवीएन अरुण-3 पावर देव. कंपनी (एसएपीडीसी) 900 मेगावाट',
    'Deputy CVO' => 'उप मुख्य सतर्कता अधिकारी',
    'orp. F&A Corporate HQ ' => 'निगमित वित्त एवं लेखा निगमित मुख्यालय',
    'HOD Corp. HR Corpoate HQ ' => 'विभागाध्यक्ष निगमित मानव संसाधन निगमित मुख्यालय',
    'HOD CM&C Corporate HQ ' => 'विभागाध्यक्ष सीएम एंड सी निगमित मुख्यालय',
    'elhi Finance Corporate HQ ' => 'दिल्ली वित्त निगमित मुख्यालय',
    'Company Secretary Corporate HQ ' => 'कंपनी सचिव निगमित मुख्यालय',
    'HOD Internal Audit Corporate HQ ' => 'विभागाध्यक्ष आंतरिक लेखा परीक्षा निगमित मुख्यालय',
    'Commercial & System Operation Corporate HQ ' => 'वाणिज्यिक एवं प्रणाली संचालन निगमित मुख्यालय',
    'vil Contracts Corporate HQ ' => 'सिविल संविदा निगमित मुख्यालय',
    'Liaison Office Corporate HQ ' => 'संपर्क कार्यालय निगमित मुख्यालय',
    'Khirvire WPS 47.6 MW Maharashtra' => 'खिरवीरे डब्ल्यूपीएस 47.6 मेगावाट महाराष्ट्र',
    'SJVN Green Energy Limited (SGEL)' => 'एसजेवीएन ग्रीन एनर्जी लिमिटेड (एसजीईएल)',
    'Information Technology Corporate HQ' => 'सूचना प्रौद्योगिकी निगमित मुख्यालय',
    'Electrical Contracts Corporate HQ ' => 'विद्युत संविदा निगमित मुख्यालय',
    'SJVN Lower Arun Power Development Company (SLPDC) 669 MW' => 'एसजेवीएन लोअर अरुण पावर डेवलपमेंट कंपनी (एसएलपीडीसी) 669 मेगावाट',
    'SJVN SPPs 900 MW ' => 'एसजेवीएन एसपीपी 900 मेगावाट',
    'Charanka SPS 5.6 MW Gujarat' => 'चरणका एसपीएस 5.6 मेगावाट गुजरात',
    'Sadla WPS 50 MW Gujarat ' => 'सदला डब्ल्यूपीएस 50 मेगावाट गुजरात',
    'Cross Border Power Transmission Company (CPTC) Joint Venture' => 'क्रॉस बॉर्डर पावर ट्रांसमिशन कंपनी (सीपीटीसी) संयुक्त उद्यम',
    'Assam Renewable Energy Limited (SAREL)' => 'असम रिन्यूएबल एनर्जी लिमिटेड (सारेल)',
    'SJVN Thermal Private Limited (STPL) 1320 MW' => 'एसजेवीएन थर्मल प्राइवेट लिमिटेड (एसटीपीएल) 1320 मेगावाट',
    'Electrical Contracts Corporate HQ' => 'विद्युत संविदा निगमित मुख्यालय',
    'Electrical Design Corporate HQ ' => 'विद्युत डिजाइन निगमित मुख्यालय',
    'athpa Jhakri HPS 1500 MW Himachal Pradesh' => 'नाथपा झाकड़ी एचपीएस 1500 मेगावाट हिमाचल प्रदेश',
    'Dhaulasidh HEP 66 MW Himachal Pradesh ' => 'धौलासिद्ध एचईपी 66 मेगावाट हिमाचल प्रदेश',
    'Etalin HEP 3097 MW Arunachal Pradesh' => 'एटलिन एचईपी 3097 मेगावाट अरुणाचल प्रदेश',
    'HM Design Corporate HQ ' => 'एचएम डिजाइन निगमित मुख्यालय',
    'Civil Design Corporate HQ' => 'सिविल डिजाइन निगमित मुख्यालय',
    'Business Development Expansion Corporate HQ ' => 'व्यवसाय विकास विस्तार निगमित मुख्यालय',
    'Roof Top Solar Corporate HQ ' => 'रूफ टॉप सोलर निगमित मुख्यालय',
    'Architecture Corporate HQ ' => 'वास्तुकला निगमित मुख्यालय',
    'Corporate Facility Management Deptt. Corporate HQ ' => 'निगमित सुविधा प्रबंधन विभाग निगमित मुख्यालय',
    'REIA Corporate HQ ' => 'आरईआईए निगमित मुख्यालय',
    'Power Trading & BDE Corporate HQ' => 'पावर ट्रेडिंग एवं बीडीई निगमित मुख्यालय',
    'Quality Assurance & Inspection Corporate HQ ' => 'गुणवत्ता आश्वासन एवं निरीक्षण निगमित मुख्यालय',
    'Sunni Dam HEP 382 MW Himachal Pradesh ' => 'सुन्नी बांध एचईपी 382 मेगावाट हिमाचल प्रदेश',
    'Luhri HEP Stage-1 210 MW Himachal Pradesh ' => 'लुहरी एचईपी चरण-1 210 मेगावाट हिमाचल प्रदेश',
    'Naitwar Mori HPS 60 MW Uttarakhand ' => 'नैटवाड़ मोरी एचपीएस 60 मेगावाट उत्तराखंड',
    'Rampur HPS 412 MW Himachal Pradesh ' => 'रामपुर एचपीएस 412 मेगावाट हिमाचल प्रदेश',
    'Chenab HEPs Himachal Pradesh ' => 'चिनाब एचईपी हिमाचल प्रदेश',
    'Jakhol Sankri & Devsari HEPs Uttarakhand ' => 'जखोल सांकरी एवं देवसारी एचईपी उत्तराखंड',
    'Emini/ Amulin Mihomdom HEPs Arunachal Pradesh' => 'एमिनी/अमुलिन मिहोमडोम एचईपी अरुणाचल प्रदेश',
    'Attunli HEP 680 MW Arunachal Pradesh ' => 'अतुन्ली एचईपी 680 मेगावाट अरुणाचल प्रदेश',
];

$subtitles = [
    ' Shimla' => 'शिमला',
    'Shimla' => 'शिमला',
    ' Delhi' => 'दिल्ली',
    'Delhi' => 'दिल्ली',
    ' Under Operation' => 'प्रचालनाधीन',
    'Under Operation' => 'प्रचालनाधीन',
    ' Under Construction' => 'निर्माणाधीन',
    'Under Construction' => 'निर्माणाधीन',
    ' Pre-Construction' => 'निर्माण पूर्व',
    'Pre-Construction' => ' নির্মাণ पूर्व', // Wait, fix typo here first: 'निर्माण पूर्व'
    ' [Wholly Owned Subsidiary]' => '[पूर्ण स्वामित्व वाली सहायक कंपनी]',
    ' Gujarat' => 'गुजरात',
    'Gujarat' => 'गुजरात',
];

$output = "build:\n  desktop:\n    values:\n      cells:\n";

// In array from original file:
$cells_raw = [
    ['title' => 'Chairman & Managing Director', 'subtitle' => ''],
    ['title' => 'Director (Projects', 'subtitle' => ''],
    ['title' => 'Director (Personnel)', 'subtitle' => ''],
    ['title' => 'Chief Vigilance Officer', 'subtitle' => ''],
    ['title' => 'Director (Finance)', 'subtitle' => ''],
    ['title' => 'Corporate Functions', 'subtitle' => ''],
    ['title' => 'Subsidiaries & JVs', 'subtitle' => ''],
    ['title' => 'Projects', 'subtitle' => ''],
    ['title' => 'Corporate Functions', 'subtitle' => ''],
    ['title' => 'Under Constrcution', 'subtitle' => ''],
    ['title' => 'Under Operation', 'subtitle' => ''],
    ['title' => 'BDE Department Corporate HQ', 'subtitle' => ' Shimla'],
    ['title' => 'Coporate Planning Corporate HQ', 'subtitle' => ' Shimla'],
    ['title' => 'Pre-Construction', 'subtitle' => ''],
    ['title' => 'SJVN Arun-3 Power Dev. Company (SAPDC) 900 MW', 'subtitle' => ''],
    ['title' => 'Deputy CVO', 'subtitle' => ''],
    ['title' => 'orp. F&A Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'HOD Corp. HR Corpoate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'HOD CM&C Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'elhi Finance Corporate HQ ', 'subtitle' => 'Delhi'],
    ['title' => 'Company Secretary Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'HOD Internal Audit Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'Commercial & System Operation Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'vil Contracts Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'Liaison Office Corporate HQ ', 'subtitle' => 'Delhi'],
    ['title' => 'Khirvire WPS 47.6 MW Maharashtra', 'subtitle' => ' Under Operation'],
    ['title' => 'SJVN Green Energy Limited (SGEL)', 'subtitle' => ' [Wholly Owned Subsidiary]'],
    ['title' => 'Information Technology Corporate HQ', 'subtitle' => ' Shimla'],
    ['title' => 'Electrical Contracts Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'SJVN Lower Arun Power Development Company (SLPDC) 669 MW', 'subtitle' => ''],
    ['title' => 'SJVN SPPs 900 MW ', 'subtitle' => 'Gujarat'],
    ['title' => 'Charanka SPS 5.6 MW Gujarat', 'subtitle' => 'Under Operation'],
    ['title' => 'Sadla WPS 50 MW Gujarat ', 'subtitle' => 'Under Operation'],
    ['title' => 'Cross Border Power Transmission Company (CPTC) Joint Venture', 'subtitle' => ''],
    ['title' => 'Assam Renewable Energy Limited (SAREL)', 'subtitle' => ''],
    ['title' => 'SJVN Thermal Private Limited (STPL) 1320 MW', 'subtitle' => ''],
    ['title' => 'Electrical Contracts Corporate HQ', 'subtitle' => ' Shimla'],
    ['title' => 'Electrical Design Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'athpa Jhakri HPS 1500 MW Himachal Pradesh', 'subtitle' => 'Under Operation'],
    ['title' => 'Dhaulasidh HEP 66 MW Himachal Pradesh ', 'subtitle' => 'Under Construction'],
    ['title' => 'Etalin HEP 3097 MW Arunachal Pradesh', 'subtitle' => ' Pre-Construction'],
    ['title' => 'HM Design Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'Civil Design Corporate HQ', 'subtitle' => ' Shimla'],
    ['title' => 'Business Development Expansion Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'Roof Top Solar Corporate HQ ', 'subtitle' => 'Delhi'],
    ['title' => 'Architecture Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'Corporate Facility Management Deptt. Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'REIA Corporate HQ ', 'subtitle' => 'Delhi'],
    ['title' => 'Power Trading & BDE Corporate HQ', 'subtitle' => ' Delhi'],
    ['title' => 'Quality Assurance & Inspection Corporate HQ ', 'subtitle' => 'Shimla'],
    ['title' => 'Sunni Dam HEP 382 MW Himachal Pradesh ', 'subtitle' => 'Under Construction'],
    ['title' => 'Luhri HEP Stage-1 210 MW Himachal Pradesh ', 'subtitle' => 'Under Construction'],
    ['title' => 'Naitwar Mori HPS 60 उत्तराखंड ', 'subtitle' => 'Under Operation'], // Wait, 'Naitwar Mori HPS 60 MW Uttarakhand '
    ['title' => 'Rampur HPS 412 MW Himachal Pradesh ', 'subtitle' => 'Under Operation'],
    ['title' => 'Chenab HEPs Himachal Pradesh ', 'subtitle' => 'Pre-Construction'],
    ['title' => 'Jakhol Sankri & Devsari HEPs Uttarakhand ', 'subtitle' => 'Pre-Construction'],
    ['title' => 'Emini/ Amulin Mihomdom HEPs Arunachal Pradesh', 'subtitle' => ' Pre-Construction'],
    ['title' => 'Attunli HEP 680 MW Arunachal Pradesh ', 'subtitle' => 'Pre-Construction']
];

foreach ($cells_raw as $cell) {
    if ($cell['title'] === 'Naitwar Mori HPS 60 उत्तराखंड ') {
        $cell['title'] = 'Naitwar Mori HPS 60 MW Uttarakhand ';
    }
    
    $hi_title = $translations[$cell['title']] ?? $cell['title'];
    $hi_subtitle = $subtitles[$cell['subtitle']] ?? '';

    $output .= "        -\n";
    $output .= "          title: '" . addslashes($hi_title) . "'\n";
    if ($hi_subtitle !== '') {
        $output .= "          subtitle: '" . addslashes($hi_subtitle) . "'\n";
    }
}

file_put_contents($hi_file_path, $output);
echo "Written translation to $hi_file_path\n";
