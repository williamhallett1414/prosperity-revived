import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { query, limit = 5, category = null } = await req.json();

    if (!query || query.trim().length === 0) {
      return Response.json({ error: 'Query is required' }, { status: 400 });
    }

    // Build filter
    const filter = { is_curated: true };
    if (category) {
      filter.category = category;
    }

    // Get all curated sources
    const allSources = await base44.asServiceRole.entities.KnowledgeSource.filter(filter, '-created_date', 100);

    if (!allSources || allSources.length === 0) {
      return Response.json({ sources: [], query });
    }

    // Score sources by relevance to query
    const queryLower = query.toLowerCase();
    const scoredSources = allSources.map(source => {
      let score = 0;

      // Title match (highest weight)
      if (source.title && source.title.toLowerCase().includes(queryLower)) {
        score += 30;
      }

      // Summary match
      if (source.summary && source.summary.toLowerCase().includes(queryLower)) {
        score += 20;
      }

      // Keywords match
      if (source.keywords && Array.isArray(source.keywords)) {
        const matchingKeywords = source.keywords.filter(k => 
          k.toLowerCase().includes(queryLower) || queryLower.includes(k.toLowerCase())
        );
        score += matchingKeywords.length * 10;
      }

      // Relevance tags match
      if (source.relevance_tags && Array.isArray(source.relevance_tags)) {
        const matchingTags = source.relevance_tags.filter(t => 
          t.toLowerCase().includes(queryLower) || queryLower.includes(t.toLowerCase())
        );
        score += matchingTags.length * 8;
      }

      // Category bonus if exact match
      if (source.category && source.category.includes(queryLower)) {
        score += 5;
      }

      return { ...source, relevance_score: score };
    });

    // Sort by score and limit
    const topSources = scoredSources
      .filter(s => s.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, Math.min(limit, 5));

    return Response.json({ 
      sources: topSources,
      query,
      total_found: topSources.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});