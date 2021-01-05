export const showInstallPrompt = () => {
  const prompt = document.createElement('div');
  prompt.setAttribute('class', 'newVersionPrompt');
  prompt.innerHTML = `
    <div class="content">
        <h1>New Version Available!</h1>
        <p>The app was updated to the latest version. Press the button to start using the update.</p>
        <button onclick="window.location.reload()">Update</button>
    </div>
  `;
  document.querySelector('body').appendChild(prompt);
};
