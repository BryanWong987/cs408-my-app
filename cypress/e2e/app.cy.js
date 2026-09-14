describe('Navigation', () => {
  it('Should navigate to the "Hello World" page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')
 
    // Find a link with an href attribute containing "hello_world" and click it
    cy.get('a[href*="hello_world/"]').click()
 
    // The new url should include "/hello_world"
    cy.url().should('include', '/hello_world')
 
    // The new page should contain an h1 with "Hello World!"
    cy.get('h1').contains('Hello World!')
  })
})