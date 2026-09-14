import Page from '../../app/page'
 
describe('<Page />', () => {
  it('should render and display expected content', () => {
    // Mount the React component for the Home page
    cy.mount(<Page />)
 
    // The new page should contain an h1 with "Home"
    cy.get('h1').contains('To get started')
 
    // Validate that a link with the expected URL is present
    // Following the link is better suited to an E2E test
    cy.get('a[href="hello_world/"]').should('be.visible')
  })
})