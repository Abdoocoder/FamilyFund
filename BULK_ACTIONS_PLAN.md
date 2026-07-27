# Bulk Payment Actions — Design Plan

## Problem
The Treasurer manages 48 members × 12 months = 576 payment cells. Currently, each cell must be toggled individually. For common operations (marking all payments for a month as paid, reverting a bulk mistake), this is tedious.

## Proposed Bulk Actions

### 1. "Mark All Paid" for a Month
- **Trigger**: Click a month column header in the matrix
- **Action**: Set all active members' payments for that month to `paid`
- **Confirmation**: Show a confirm dialog: "هل تريد تسجيل مدفوعات شهر {month} لكل الأعضاء النشطين؟"
- **Undo**: Show undo toast (3s) after bulk action

### 2. "Mark All Unpaid" for a Month
- **Trigger**: Long-press or right-click on a month column header
- **Action**: Reset all payments for that month to `unpaid`
- **Confirmation**: Required — this is destructive

### 3. Row-Level "Mark All Paid" for a Member
- **Trigger**: Click the member's total cell (rightmost column)
- **Action**: Mark all 12 months as `paid` for that member
- **Confirmation**: Required

### 4. Bulk Selection Mode
- **Trigger**: "تحديد جماعي" toggle button in the toolbar
- **Behavior**: Checkboxes appear on each cell; user can multi-select cells, then apply a status change in bulk
- **Use case**: Selecting scattered cells across different months/members

## Implementation Priority
1. **Phase 1**: Month column "Mark All Paid" (highest value, simplest)
2. **Phase 2**: Member row "Mark All Paid"
3. **Phase 3**: Bulk selection mode (most complex, least urgent)

## Technical Notes
- Each bulk action should write to `auditLogs` with a descriptive entry
- Use the existing `setPaymentStatus` function for each cell in the bulk operation
- All bulk actions should show the UndoToast after completion
- Confirmation dialogs use `window.confirm` for now (consistent with archive confirmation)
