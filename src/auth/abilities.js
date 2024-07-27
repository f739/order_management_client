import { defineAbility } from '@casl/ability';

const defineAdminAbilities = (can, cannot) => {
  can('manage', 'all');
}

const defineEmployeeAbilities = (can, cannot, user) => {
  can('enter', ['Order', 'PendingOrders', 'OldOrder']);
  cannot('enter', ['IssuingReport', 'NavPrivet', 'CreateUser',
  'Product', 'Supplier', 'Measure', 'Category', 'Branches', 'Log', 'companySettings']);
  can('read', 'Order', [user.branch._id] );
  can('read', 'PendingOrders', [user.branch._id] );
  can('read', 'OldOrder', [user.branch._id] );
  // can('delete', 'PendingOrders', [user._id]) להוסיף לכל הזמנה ID של מי שיצר אותה ולתת לו למחוק את ההזמנה שלו
  cannot('delete', ['PendingOrders', 'OldOrder', 'Branch', 'Supplier']);
  cannot('create', ['PendingOrders', 'Supplier', 'Category', 'User', 'Measure', 'Product', 'Branch']);
  cannot('update', ['Supplier', 'Product', 'Branch', 'Measure', 'Category']);
  can('create', 'Order');
  can('update', ['Order']);
  cannot('delete', 'all'); 
}

const defineAccountantAbilities = (can, cannot) => {
  can('enter', 'IssuingReport');
  cannot('enter', ['Order', 'PendingOrders', 'OldOrder', 'NavPrivet', 'CreateUser',
  'Product', 'Supplier', 'Measure', 'Category', 'Log', 'CompanySettings']);
  cannot(['create', 'delete'], ['PendingOrders', 'Order'])
}

const defineGuestAbilities = (can, cannot) => {
    cannot('enter', 'all');
    can('create', 'Company');
}

export const defineAbilitiesFor = user => defineAbility((can, cannot) => {

  switch (user.license) {
    case 'מנהל':
      defineAdminAbilities(can, cannot);
      break;
    case 'purchasingManager':
      defineAdminAbilities(can, cannot);
      break;
    case 'cooker':
      defineEmployeeAbilities(can, cannot, user);
      break;
    case 'accountant':
      defineAccountantAbilities(can, cannot);
      break;
    case 'guest': 
        defineGuestAbilities(can, cannot);
    default:
      break;
  }
})
