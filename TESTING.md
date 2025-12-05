# Testing Guide

## Manual Testing Checklist

### Authentication Flow

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Token refresh on 401 response
- [ ] Logout functionality
- [ ] Protected routes redirect to login when not authenticated
- [ ] Authenticated users can't access login page (redirect to dashboard)

### Dashboard

- [ ] Statistics cards display correct counts
- [ ] All data loads without errors
- [ ] Loading spinner shows while fetching data
- [ ] Error message displays if API fails

### Profile Page

- [ ] User information displays correctly
- [ ] Role badge shows correct color
- [ ] Status badge shows correct state
- [ ] Last login time formats correctly

### Clients Page

- [ ] All clients load and display in table
- [ ] Search functionality works for:
  - [ ] Name
  - [ ] Email
  - [ ] Phone
  - [ ] Address
- [ ] Empty state shows when no clients found
- [ ] Loading spinner shows while fetching

### Warehouses Page

- [ ] All warehouses display correctly
- [ ] Capacity usage bar shows correct percentage
- [ ] Color coding for capacity (green < 60%, yellow 60-80%, red > 80%)
- [ ] Empty state shows when no warehouses

### Products Page

- [ ] All products display in table
- [ ] Search works for name, description, and category
- [ ] Category badges display
- [ ] Price and prime cost format correctly
- [ ] Margin calculation is accurate
- [ ] Empty state shows when no products

### Stocks Page

- [ ] All stocks display correctly
- [ ] Stock status badges show correct colors:
  - [ ] Low Stock (red) - quantity <= minimum
  - [ ] Overstock (yellow) - quantity >= maximum
  - [ ] Normal (green) - between min and max
- [ ] Last updated timestamp formats correctly
- [ ] Empty state shows when no stocks

### Transactions Page

- [ ] All transactions display
- [ ] Filter buttons work for:
  - [ ] All
  - [ ] Sale
  - [ ] Return
  - [ ] Exchange
  - [ ] Arrival
- [ ] Transaction type badges show correct colors
- [ ] Status badges display correctly
- [ ] Prices format with currency
- [ ] Date/time formats correctly
- [ ] Empty state shows when no transactions

### UI/UX

- [ ] Sidebar navigation works
- [ ] Active page highlighted in sidebar
- [ ] Header shows current page title
- [ ] User info displays in header
- [ ] Logout button works
- [ ] Responsive design (test on mobile/tablet)
- [ ] Loading states are smooth
- [ ] Error messages are clear
- [ ] Empty states are informative

### Performance

- [ ] Initial page load < 3 seconds
- [ ] Navigation between pages is instant
- [ ] No console errors
- [ ] No memory leaks (check DevTools)
- [ ] Images/assets load properly

### Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## API Testing

### Test with Mock Data

If backend is not ready, you can use mock data:

1. Create `src/services/mockData.ts`
2. Replace API calls with mock responses
3. Test all UI functionality

### Test Error Scenarios

- [ ] Network offline
- [ ] API returns 500 error
- [ ] API returns 404 error
- [ ] Slow API response (> 5 seconds)
- [ ] Invalid token
- [ ] Expired token

## Automated Testing (Future)

Consider adding:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Example test structure:

```typescript
// src/pages/__tests__/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

test('renders dashboard statistics', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Total Products/i)).toBeInTheDocument();
});
```

## Load Testing

For production readiness:

1. Use tools like Apache JMeter or k6
2. Test concurrent users (50, 100, 500)
3. Monitor response times
4. Check for memory leaks

## Security Testing

- [ ] XSS protection (test input fields)
- [ ] CSRF protection (if applicable)
- [ ] SQL injection (backend responsibility)
- [ ] Authentication bypass attempts
- [ ] Token manipulation
- [ ] HTTPS enforcement

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible
- [ ] Alt text for images (if any)

## Pre-Production Checklist

- [ ] All manual tests pass
- [ ] No console errors or warnings
- [ ] Build completes successfully
- [ ] Environment variables configured
- [ ] API endpoints correct
- [ ] Error boundaries working
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Monitoring setup (optional)
