import { defineAbility } from '@casl/ability';

const defineAdminAbilities = (can, cannot) => {
  can('manage', 'all');
}

const defineEmployeeAbilities = (can, cannot, user) => {
  can('enter', ['Order', 'PendingOrders', 'OldOrder']);
  cannot('enter', ['IssuingReport', 'NavPrivet', 'CreateUser',
  'Product', 'Supplier', 'Measure', 'Category', 'Log', 'Settings']);
  can('read', 'Order', [user.factory] );
  can('read', 'PendingOrders', [user.factory] );
  can('read', 'OldOrder', [user.factory] );
  // can('delete', 'PendingOrders', [user._id]) להוסיף לכל הזמנה ID של מי שיצר אותה ולתת לו למחוק את ההזמנה שלו
  cannot('delete', 'PendingOrders');
  cannot('delete', 'OldOrder');
  cannot('create', 'PendingOrders')
  can('create', 'Order');
  can('update', 'Order');
  cannot('delete', 'all'); 
}

const defineAccountantAbilities = (can, cannot) => {
  can('enter', 'IssuingReport');
  cannot('enter', ['Order', 'PendingOrders', 'OldOrder', 'NavPrivet', 'CreateUser',
  'Product', 'Supplier', 'Measure', 'Category', 'Log', 'Settings']);
  cannot(['create', 'delete'], 'PendingOrders')

}

const defineGuestAbilities = (can, cannot) => {
    cannot('enter', 'all');
}

export const defineAbilitiesFor = user => defineAbility((can, cannot) => {

  switch (user.license) {
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
