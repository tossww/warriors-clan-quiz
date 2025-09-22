import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { clanId, clanName, traits, characteristics, color } = await request.json();

    if (!clanId || !clanName) {
      return NextResponse.json({ error: 'Clan ID and name are required' }, { status: 400 });
    }

    // Create a detailed prompt based on clan attributes
    const iconPrompt = createIconPrompt(clanName, traits, characteristics, color);
    console.log('\n========== SENDING TO GOOGLE GEMINI ==========');
    console.log('CLAN:', clanName);
    console.log('COLOR:', color);
    console.log('FULL PROMPT:', iconPrompt);
    console.log('==============================================\n');

    // Skip Gemini API and use our hand-crafted icons
    const useCustomIcons = true; // Set to false to use Gemini API

    if (useCustomIcons) {
      // Use our custom designed SVG icons
      const customSvg = generateFallbackSvg(clanName, color, traits);
      return NextResponse.json({
        success: true,
        svgData: customSvg,
        prompt: iconPrompt,
        timestamp: Date.now(),
        custom: true
      });
    }

    // Call Google Gemini API for icon generation (currently disabled)
    const apiUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const apiKey = process.env.GEMINI_API_KEY;

    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${iconPrompt}

IMPORTANT COLOR PALETTE for ${clanName}:
- Primary color: ${color}
- Secondary: A lighter tint of ${color}
- Border: A darker shade of ${color}

OUTPUT REQUIREMENTS:
- Return ONLY valid SVG code
- No explanations, comments, or markdown
- Start with <svg and end with </svg>
- Must be a complete, working SVG

Example structure:
<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <circle cx="128" cy="128" r="120" fill="${color}" stroke="darker-shade" stroke-width="2"/>
  <path d="..." fill="white"/>
</svg>`
            }]
          }],
          generationConfig: {
            temperature: 0.4,  // Lower temperature for more consistent results
            topK: 20,          // More focused selection
            topP: 0.8,         // More deterministic
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract SVG from Gemini response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Try to extract SVG code from the response
      let svgData = generatedText;
      const svgMatch = generatedText.match(/<svg[^>]*>.*?<\/svg>/s);
      if (svgMatch) {
        svgData = svgMatch[0];
      }

      // Validate it's actually SVG
      if (!svgData.includes('<svg')) {
        throw new Error('No valid SVG in response');
      }

      return NextResponse.json({
        success: true,
        svgData: svgData,
        prompt: iconPrompt,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Gemini API error:', error);

      // Always use our custom designed fallback icons
      const fallbackSvg = generateFallbackSvg(clanName, color, traits);

      return NextResponse.json({
        success: true,
        fallback: true,
        svgData: fallbackSvg,
        error: 'Using fallback icon'
      });
    }

  } catch (error) {
    console.error('Error in clan icon generation API:', error);
    return NextResponse.json({ error: 'Failed to generate clan icon' }, { status: 500 });
  }
}

function createIconPrompt(clanName: string, traits: string[], characteristics: string[], color: string): string {
  const clanDesigns: { [key: string]: { symbol: string, description: string } } = {
    'ThunderClan': {
      symbol: 'lightning bolt striking through an oak tree',
      description: 'Create a strong oak tree with a dramatic lightning bolt cutting through it. The oak represents their forest territory, and lightning represents Thunder (their founder). Include oak leaves. The design should convey courage, strength, and their connection to the deciduous forest.'
    },
    'RiverClan': {
      symbol: 'fish leaping above willow branches and river waves',
      description: 'Design a sleek fish (like a river trout) jumping above flowing water waves, with drooping willow branch elements framing the scene. Include small river stones or shells at the bottom. This represents their love of water, fishing skills, and their island camp surrounded by willows.'
    },
    'WindClan': {
      symbol: 'running rabbit silhouette with heather and stars',
      description: 'Show a leaping rabbit (their main prey) in profile with sprigs of heather beneath it and small stars above, representing their belief they are closest to StarClan. Add subtle wind swirls. This captures their moorland home, speed, and spiritual connection.'
    },
    'ShadowClan': {
      symbol: 'pine tree silhouette with crescent moon and marsh reeds',
      description: 'Create a dark pine tree (their territory marker) with a crescent moon visible through the branches, and marsh reeds at the base. Add subtle shadow patterns. This represents their pine forest territory, night hunting skills, and marshy homeland.'
    },
    'SkyClan': {
      symbol: 'cat climbing a tree trunk with extended claws',
      description: 'Design a cat silhouette climbing vertically up a tree trunk, with visible claw marks in the bark. Show strong branches spreading outward. This represents their unique climbing abilities and their return to the forest after exile.'
    },
    'Tribe of Rushing Water': {
      symbol: 'mountain peak with waterfall cascading into a cave',
      description: 'Create a triangular mountain with a prominent waterfall flowing down into a cave entrance at the base. Add some rocky outcroppings and mist effects. This represents their mountain home, the Cave of Rushing Water, and their ancient traditions.'
    }
  };

  const clan = clanDesigns[clanName] || {
    symbol: 'a stylized cat face',
    description: 'Create a simple, geometric cat face with pointed ears'
  };

  // Authentic Warriors-inspired prompt
  const prompt = `Create a Warriors Cats clan badge based on the official book series lore.

DESIGN REQUIREMENTS:
You must create a circular badge with this exact structure:
1. Outer circle: ${color} background
2. Dark border ring: 20% darker than ${color}
3. Inner white circle for the symbol
4. The clan symbol in ${color} on the white background

${clanName.toUpperCase()} AUTHENTIC DETAILS:
${clan.description}

CRITICAL SYMBOL ELEMENTS: ${clan.symbol}

STYLE GUIDELINES:
- This is based on the Warriors book series by Erin Hunter
- The design should look like an official clan emblem that warriors would wear
- Keep it simple but meaningful - each element should represent the clan's identity
- Use clean, bold shapes that work as a badge or patch
- The symbol must be immediately recognizable as representing ${clanName}
- Think of it as a military unit patch or sports team crest

TECHNICAL SPECS:
- SVG format with viewBox="0 0 256 256"
- Outer circle radius: 118px centered at (128, 128)
- Border: 6px stroke
- Inner white circle radius: 100px
- Symbol should use 70% of the white circle space
- Use paths with stroke-width of at least 3px for visibility

Remember: This represents the ${traits.join(', ')} warriors of ${clanName}.`;

  return prompt;
}

function generateFallbackSvg(clanName: string, color: string, traits: string[]): string {
  // Generate darker color for border (20% darker)
  const darkerColor = color.replace('#', '');
  const r = parseInt(darkerColor.substr(0, 2), 16);
  const g = parseInt(darkerColor.substr(2, 2), 16);
  const b = parseInt(darkerColor.substr(4, 2), 16);
  const darker = `#${Math.round(r * 0.8).toString(16).padStart(2, '0')}${Math.round(g * 0.8).toString(16).padStart(2, '0')}${Math.round(b * 0.8).toString(16).padStart(2, '0')}`;

  // Hand-crafted Warriors-inspired symbols
  const symbols: { [key: string]: string } = {
    'ThunderClan': `
      <!-- Lightning bolt -->
      <path d="M 128 60 L 108 100 L 125 100 L 115 140 L 135 140 L 120 180 L 150 110 L 133 110 L 143 70 Z"
            fill="${color}" stroke="${color}" stroke-width="2"/>
      <!-- Oak leaves -->
      <path d="M 100 75 Q 90 70, 85 75 Q 80 80, 85 85 Q 90 80, 100 75 Z" fill="${color}" opacity="0.7"/>
      <path d="M 156 75 Q 166 70, 171 75 Q 176 80, 171 85 Q 166 80, 156 75 Z" fill="${color}" opacity="0.7"/>
    `,
    'RiverClan': `
      <!-- Fish -->
      <ellipse cx="128" cy="95" rx="25" ry="12" fill="${color}"/>
      <path d="M 148 95 L 158 88 L 158 102 Z" fill="${color}"/>
      <circle cx="115" cy="93" r="2" fill="white"/>
      <!-- Water waves -->
      <path d="M 88 120 Q 108 115, 128 120 Q 148 115, 168 120" stroke="${color}" stroke-width="3" fill="none"/>
      <path d="M 88 135 Q 108 130, 128 135 Q 148 130, 168 135" stroke="${color}" stroke-width="3" fill="none"/>
      <path d="M 88 150 Q 108 145, 128 150 Q 148 145, 168 150" stroke="${color}" stroke-width="3" fill="none"/>
    `,
    'WindClan': `
      <!-- Rabbit silhouette -->
      <ellipse cx="128" cy="110" rx="18" ry="15" fill="${color}"/>
      <ellipse cx="145" cy="108" rx="8" ry="5" fill="${color}"/>
      <ellipse cx="118" cy="95" rx="4" ry="10" fill="${color}" transform="rotate(-15 118 95)"/>
      <ellipse cx="125" cy="95" rx="4" ry="10" fill="${color}" transform="rotate(5 125 95)"/>
      <!-- Wind streaks -->
      <path d="M 85 130 Q 105 128, 125 130" stroke="${color}" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M 90 140 Q 110 138, 130 140" stroke="${color}" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M 85 150 Q 105 148, 125 150" stroke="${color}" stroke-width="2" fill="none" opacity="0.6"/>
    `,
    'ShadowClan': `
      <!-- Pine tree -->
      <path d="M 128 70 L 108 100 L 118 100 L 103 125 L 113 125 L 98 150 L 158 150 L 143 125 L 153 125 L 138 100 L 148 100 Z"
            fill="${color}"/>
      <!-- Crescent moon -->
      <path d="M 155 80 Q 165 85, 165 95 Q 165 105, 155 110 Q 160 105, 160 95 Q 160 85, 155 80 Z"
            fill="${color}" opacity="0.8"/>
    `,
    'SkyClan': `
      <!-- Tree trunk -->
      <rect x="123" y="110" width="10" height="50" fill="${color}"/>
      <!-- Branches -->
      <path d="M 128 110 L 108 90 M 128 120 L 148 100 M 128 130 L 108 115 M 128 140 L 148 125"
            stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <!-- Cat paw climbing -->
      <circle cx="115" cy="125" r="4" fill="${color}"/>
      <circle cx="108" cy="120" r="2" fill="${color}"/>
      <circle cx="110" cy="115" r="2" fill="${color}"/>
      <circle cx="115" cy="117" r="2" fill="${color}"/>
    `,
    'Tribe of Rushing Water': `
      <!-- Mountain -->
      <path d="M 128 65 L 88 160 L 168 160 Z" fill="${color}"/>
      <!-- Snow cap -->
      <path d="M 128 65 L 113 95 L 143 95 Z" fill="white" opacity="0.8"/>
      <!-- Waterfall -->
      <rect x="125" y="90" width="6" height="40" fill="white" opacity="0.6"/>
      <rect x="125" y="135" width="6" height="25" fill="${darker}" opacity="0.4"/>
      <!-- Cave entrance -->
      <ellipse cx="128" cy="145" rx="15" ry="10" fill="${darker}"/>
    `
  };

  const symbol = symbols[clanName] || symbols['ThunderClan'];

  return `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer circle background -->
  <circle cx="128" cy="128" r="120" fill="${color}" />
  <!-- Dark border ring -->
  <circle cx="128" cy="128" r="120" fill="none" stroke="${darker}" stroke-width="4" />
  <!-- White inner circle for symbol background -->
  <circle cx="128" cy="128" r="100" fill="white" />
  <!-- Clan symbol in center -->
  <path d="${symbol}" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill-rule="evenodd" />
</svg>`;
}