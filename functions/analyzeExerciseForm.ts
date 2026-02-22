import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { video_url, exercise_name } = await req.json();

    if (!video_url || !exercise_name) {
      return Response.json({ 
        error: 'Missing video_url or exercise_name' 
      }, { status: 400 });
    }

    const context = `You are an elite fitness coach with expertise in exercise form, biomechanics, and injury prevention.

TASK: Analyze the provided exercise video for form and technique.

Exercise: ${exercise_name}

Provide a detailed analysis in JSON format:
{
  "exercise_name": "string",
  "overall_form_score": "1-10",
  "form_assessment": "detailed analysis of form quality",
  "strengths": ["list of what they're doing well"],
  "areas_for_improvement": ["specific areas needing correction"],
  "detailed_corrections": [
    {
      "issue": "specific form issue",
      "correction": "how to fix it",
      "why_it_matters": "explanation of importance"
    }
  ],
  "injury_prevention_tips": ["safety tips specific to this exercise"],
  "progression_recommendations": "how to advance this exercise",
  "common_mistakes": "most common mistake they might be making"
}

Be specific, constructive, and supportive. Focus on technique, body alignment, range of motion, breathing, and safety.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: context,
      file_urls: [video_url],
      response_json_schema: {
        type: 'object',
        properties: {
          exercise_name: { type: 'string' },
          overall_form_score: { type: 'string' },
          form_assessment: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          areas_for_improvement: { type: 'array', items: { type: 'string' } },
          detailed_corrections: { type: 'array' },
          injury_prevention_tips: { type: 'array', items: { type: 'string' } },
          progression_recommendations: { type: 'string' },
          common_mistakes: { type: 'string' }
        }
      }
    });

    // Generate visual aid diagram
    let diagram_url = null;
    try {
      const diagramResponse = await base44.integrations.Core.GenerateImage({
        prompt: `Create a professional anatomical diagram showing proper form for ${exercise_name}. Include: body position, alignment markers, muscle engagement areas, and directional arrows showing movement. Use medical illustration style with clear labels. Show side and front views if applicable.`,
        existing_image_urls: [video_url]
      });
      diagram_url = diagramResponse.url;
    } catch (e) {
      console.log('Diagram generation skipped');
    }

    return Response.json({
      ...response,
      diagram_url
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});