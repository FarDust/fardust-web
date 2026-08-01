import {
  buildExperienceHoverTargets,
  buildExperienceSearchResults,
  classifyExperienceLine,
  groupPdfItemsIntoLines,
  normalizeExperienceText,
} from './experience-document.utils';

describe('experience-document.utils', () => {
  it('should normalize curriculum text for matching', () => {
    expect(normalizeExperienceText('Gabriel Andrés  Faúndez')).toBe(
      'Gabriel Andres Faundez',
    );
  });

  it('should classify role and bullet lines', () => {
    expect(classifyExperienceLine('LEAD AI ENGINEER')).toBe('role');
    expect(
      classifyExperienceLine(
        '• Designed and implemented a single-table DynamoDB model',
      ),
    ).toBe('bullet');
  });

  it('should group extracted pdf items into ordered lines', () => {
    const lines = groupPdfItemsIntoLines(
      [
        { text: 'Lead', x: 24, y: 140, fontSize: 12 },
        { text: 'AI', x: 60, y: 140.5, fontSize: 12 },
        { text: 'Engineer', x: 84, y: 140, fontSize: 12 },
        { text: 'Blend 360', x: 24, y: 172, fontSize: 12 },
      ],
      2,
    );

    expect(lines.length).toBe(2);
    expect(lines[0].text).toBe('Blend 360');
    expect(lines[1].text).toBe('Lead AI Engineer');
  });

  it('should derive recruiter hover targets from interesting rendered lines', () => {
    const targets = buildExperienceHoverTargets([
      {
        id: 'line-1',
        pageNumber: 1,
        order: 0,
        text: 'LEAD AI ENGINEER',
        kind: 'role',
        rect: { left: 12, top: 24, width: 140, height: 20 },
      },
      {
        id: 'line-2',
        pageNumber: 1,
        order: 1,
        text: 'Led development of an AI agent to extract insights from company data.',
        kind: 'bullet',
        rect: { left: 12, top: 48, width: 300, height: 26 },
      },
    ]);

    expect(targets.length).toBe(2);
    expect(targets[0].title).toBe('Role scope');
    expect(targets[1].promptHint).toContain('recruiter-facing impact');
  });

  it('should rank search results by page text matches', () => {
    const results = buildExperienceSearchResults(
      [
        {
          pageNumber: 1,
          lines: [
            {
              id: 'line-1',
              pageNumber: 1,
              order: 0,
              text: 'Blend 360',
              kind: 'body',
              y: 10,
              items: [],
            },
          ],
        },
        {
          pageNumber: 2,
          lines: [
            {
              id: 'line-2',
              pageNumber: 2,
              order: 0,
              text: 'Implemented Clean Architecture in a serverless microservices framework',
              kind: 'bullet',
              y: 20,
              items: [],
            },
          ],
        },
      ],
      'clean architecture',
    );

    expect(results.length).toBe(1);
    expect(results[0].pageNumber).toBe(2);
  });
});
