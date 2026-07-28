import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createWrapper } from './test-utils';
import { useFund } from '../context/FundContext';

describe('togglePayment', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sets unpaid record to paid on first toggle', () => {
    const { result } = renderHook(() => useFund(), { wrapper: createWrapper() });

    const initial = result.current.payments.find(
      p => p.memberId === 'mem-1' && p.year === 2026 && p.month === 4
    );
    expect(initial?.status).toBe('unpaid');

    act(() => {
      result.current.togglePayment('mem-1', 2026, 4);
    });

    const toggled = result.current.payments.find(
      p => p.memberId === 'mem-1' && p.year === 2026 && p.month === 4
    );
    expect(toggled?.status).toBe('paid');
  });

  it('toggles paid back to unpaid', () => {
    const { result } = renderHook(() => useFund(), { wrapper: createWrapper() });

    act(() => {
      result.current.togglePayment('mem-1', 2026, 1);
    });

    const after = result.current.payments.find(
      p => p.memberId === 'mem-1' && p.year === 2026 && p.month === 1
    );
    expect(after?.status).toBe('unpaid');
  });

  it('creates new record if none exists', () => {
    const { result } = renderHook(() => useFund(), { wrapper: createWrapper() });

    const before = result.current.payments.filter(
      p => p.memberId === 'mem-1' && p.year === 1999 && p.month === 6
    );
    expect(before).toHaveLength(0);

    act(() => {
      result.current.togglePayment('mem-1', 1999, 6);
    });

    const after = result.current.payments.find(
      p => p.memberId === 'mem-1' && p.year === 1999 && p.month === 6
    );
    expect(after).toBeDefined();
    expect(after?.status).toBe('paid');
  });
});

describe('addMember', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a new member with correct fields', () => {
    const { result } = renderHook(() => useFund(), { wrapper: createWrapper() });

    const countBefore = result.current.members.length;

    act(() => {
      result.current.addMember({
        name: 'اختبار عضو',
        phone: '0791234567',
        initials: 'إ.ع',
        branch: 'فرع الاختبار',
        status: 'active',
        subscriptionAmount: 200,
      });
    });

    expect(result.current.members.length).toBe(countBefore + 1);
    const added = result.current.members.find(m => m.name === 'اختبار عضو');
    expect(added).toBeDefined();
    expect(added?.phone).toBe('0791234567');
    expect(added?.subscriptionAmount).toBe(200);
    expect(added?.status).toBe('active');
  });

  it('creates payment slots for 3 years', () => {
    const { result } = renderHook(() => useFund(), { wrapper: createWrapper() });

    act(() => {
      result.current.addMember({
        name: 'عضو اختبار الدفعات',
        phone: '',
        initials: 'ع.خ',
        status: 'active',
        subscriptionAmount: 150,
      });
    });

    const added = result.current.members.find(m => m.name === 'عضو اختبار الدفعات');
    const slots = result.current.payments.filter(p => p.memberId === added?.id);
    expect(slots).toHaveLength(36);

    slots.forEach(s => {
      expect(s.status).toBe('unpaid');
      expect(s.amount).toBe(150);
    });
  });
});

describe('exportToCSV', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates CSV with Arabic header and member data', () => {
    const { result } = renderHook(() => useFund(), { wrapper: createWrapper() });

    let capturedCsv = '';
    const origBlob = global.Blob;

    global.Blob = class extends Blob {
      constructor(parts: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        capturedCsv = String(parts[0]);
      }
    } as typeof Blob;

    const origAppend = document.body.appendChild;
    const origRemove = document.body.removeChild;
    const origClick = HTMLAnchorElement.prototype.click;
    const origCreateElement = document.createElement.bind(document);

    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    HTMLAnchorElement.prototype.click = vi.fn();
    document.createElement = vi.fn((tag: string) => {
      const el = origCreateElement(tag);
      if (tag === 'a') {
        el.click = vi.fn();
      }
      return el;
    });

    act(() => {
      result.current.exportToCSV();
    });

    expect(capturedCsv).toContain('العضو');
    expect(capturedCsv).toContain('يناير');
    expect(capturedCsv).toContain('محمد سالم أبوكف');

    global.Blob = origBlob;
    document.body.appendChild = origAppend;
    document.body.removeChild = origRemove;
    HTMLAnchorElement.prototype.click = origClick;
    document.createElement = origCreateElement;
  });
});
