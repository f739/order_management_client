import { defineAbility } from '@casl/ability';

const defineAdminAbilities = (can, cannot) => {
  can('manage', 'all');
}

const defineEmployeeAbilities = (can, cannot, user) => {
  can('enter', ['Order', 'PendingOrders', 'OldOrder', 'UserDetails', 'ContactForm']);
  can('manage', 'auth');
  cannot('enter', ['IssuingReport', 'contentManagement', 'Log', 'companySettings']);
  can('read', 'Order', [user.branch] );
  can('read', 'PendingOrders', [user.branch] );
  can('read', 'OldOrder', [user.branch] );
  // can('delete', 'PendingOrders', [user._id]) להוסיף לכל הזמנה ID של מי שיצר אותה ולתת לו למחוק את ההזמנה שלו
  cannot('delete', ['PendingOrders', 'OldOrder', 'contentManagement']);
  cannot('create', 'contentManagement');
  cannot('update', 'contentManagement');
  can('create', 'Order');
  can('update', ['Order']);
}

const defineAccountantAbilities = (can, cannot) => {
  can('enter', ['IssuingReport', 'ContactForm']);
  cannot('enter', ['Order', 'PendingOrders', 'OldOrder', 'contentManagement' ,'Log', 'CompanySettings']);
  cannot(['create', 'delete'], ['PendingOrders', 'Order'])
}

const defineGuestAbilities = (can, cannot) => {
    can('manage', 'auth');
    can('enter', 'ContactForm');
    cannot('enter', ['PendingOrders', 'contentManagement']);
    can('create', 'Company');
}

export const defineAbilitiesFor = user => defineAbility((can, cannot) => {

  switch (user.role) {
    case 'מנהל':
      defineAdminAbilities(can, cannot);
      break;
    case 'מנהל רכש':
      defineAdminAbilities(can, cannot);
      break;
    case "טבח":
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
