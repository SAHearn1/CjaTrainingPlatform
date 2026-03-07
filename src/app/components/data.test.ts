import { describe, it, expect } from 'vitest';
import { MODULES, ROLES, ROLE_LABELS } from './data';

describe('MODULES data integrity', () => {
  it('exports exactly 7 modules', () => {
    expect(MODULES).toHaveLength(7);
  });

  it('each module has required fields', () => {
    for (const mod of MODULES) {
      expect(mod.id).toBeGreaterThanOrEqual(1);
      expect(mod.title).toBeTruthy();
      expect(mod.description).toBeTruthy();
      expect(mod.duration).toBeTruthy();
      expect(Array.isArray(mod.sections)).toBe(true);
      expect(mod.sections.length).toBeGreaterThan(0);
    }
  });

  it('each module has exactly 5 sections (one per 5Rs phase)', () => {
    for (const mod of MODULES) {
      expect(mod.sections).toHaveLength(5);
    }
  });

  it('each section has the 5Rs phases in order', () => {
    const expectedPhases = ['Root', 'Regulate', 'Reflect', 'Restore', 'Reconnect'];
    for (const mod of MODULES) {
      const phases = mod.sections.map((s) => s.phase);
      expect(phases).toEqual(expectedPhases);
    }
  });

  it('each module has pre- and post-assessments with questions', () => {
    for (const mod of MODULES) {
      expect(mod.preAssessment.questions.length).toBeGreaterThan(0);
      expect(mod.postAssessment.questions.length).toBeGreaterThan(0);
    }
  });

  it('assessment questions have correct answer indices', () => {
    for (const mod of MODULES) {
      for (const q of [...mod.preAssessment.questions, ...mod.postAssessment.questions]) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
      }
    }
  });

  it('section IDs are unique within a module', () => {
    for (const mod of MODULES) {
      const ids = mod.sections.map((s) => s.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    }
  });
});

describe('ROLES and ROLE_LABELS', () => {
  it('ROLES contains expected professional roles', () => {
    const ids = ROLES.map((r) => r.id);
    expect(ids).toContain('cpi');
    expect(ids).toContain('law_enforcement');
    expect(ids).toContain('prosecutor');
  });

  it('ROLE_LABELS has entries for all ROLES', () => {
    for (const role of ROLES) {
      expect(ROLE_LABELS[role.id]).toBeTruthy();
    }
  });

  it('ROLE_LABELS includes admin and supervisor', () => {
    expect(ROLE_LABELS['admin']).toBeTruthy();
    expect(ROLE_LABELS['supervisor']).toBeTruthy();
  });
});
