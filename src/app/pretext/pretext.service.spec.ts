import { TestBed } from '@angular/core/testing';
import { type LayoutCursor } from '@chenglou/pretext';
import { PretextService } from './pretext.service';

describe('PretextService', () => {
  let service: PretextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PretextService);
  });

  it('can reject cramped line slots when routing around circular obstacles', () => {
    const prepared = service.prepareRich(
      'Building the notification blacklisting system meant presenting cluster summaries and suppression reasoning in the same panel as live pipeline telemetry. The application should keep the explanation readable instead of letting the copy collapse into a thin emergency column.',
      '500 13px "JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    );
    const region = { left: 18, top: 132, width: 360, height: 420 };
    const obstacles = [
      { x: 200, y: 154, radius: 68, padding: 14 },
      { x: 160, y: 214, radius: 72, padding: 14 },
    ];
    const start: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

    const baseline = service.layoutFlowAroundCircles(
      prepared,
      start,
      region,
      21,
      obstacles,
    );
    const guarded = service.layoutFlowAroundCircles(
      prepared,
      start,
      region,
      21,
      obstacles,
      { minSlotWidth: 158 },
    );

    const countCrampedLines = (
      lines: ReadonlyArray<{ width: number }>,
    ): number =>
      lines
        .slice(0, Math.max(0, lines.length - 4))
        .filter((line) => line.width < 140).length;

    expect(countCrampedLines(guarded.lines)).toBeLessThan(
      countCrampedLines(baseline.lines),
    );
  });
});
